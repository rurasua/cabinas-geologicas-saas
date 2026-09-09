"""
Tests unitarios para anomaly_detector — funciones PURAS.

NO requieren Firebase ni emulador. Se ejecutan con:
    cd functions
    pytest tests/test_anomaly_detector.py -v

El módulo anomaly_detector tiene dos familias de funciones:
  - detectar_anomalia_*(...): acopladas a Firestore (legacy, no se testean aquí)
  - pure_detect_*(...):       puras, toman history como param (las que se testean)
  - pure_detect_todas():      orquestador puro
"""

import os
import sys
import pytest

# Permite importar el módulo del directorio padre
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from anomaly_detector import (
    pure_detect_gas,
    pure_detect_densidad,
    pure_detect_rop,
    pure_detect_todas,
)


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────


def lectura(**overrides):
    base = {
        "cabin_id": "test_cabin",
        "timestamp": "2026-09-15T14:00:00Z",
        "md": 3500.0,
        "wob": 18.0,
        "rpm": 120,
        "spp": 2900,
        "gpm": 480,
        "torque": 12000,
        "hookload": 280000,
        "den_in": 1.20,
        "den_out": 1.18,
        "temp_in": 35.0,
        "temp_out": 38.0,
        "rop": 25.0,
        "gas_total": 1500,
    }
    base.update(overrides)
    return base


RULES_DEFAULT = {
    "gas_factor_pico": 5,
    "gas_umbral_absoluto": 5000,
    "densidad_caida_pct": 5,
    "rop_caida_pct": 80,
}


# ──────────────────────────────────────────────────────────────────────────────
# Regla 1: gas
# ──────────────────────────────────────────────────────────────────────────────


def test_gas_sin_datos_no_detecta():
    assert pure_detect_gas({"gas_total": 0}, [], RULES_DEFAULT) is None


def test_gas_por_encima_de_background_factor_5x_dispara():
    """Background=1000, gas=6000 → 6x → factor 5x dispara."""
    history = [lectura(gas_total=1000), lectura(gas_total=1100), lectura(gas_total=900)]
    r = lectura(gas_total=6000)
    hit = pure_detect_gas(r, history, RULES_DEFAULT)
    assert hit is not None
    assert hit["tipo"] == "gas_pico"
    assert hit["severidad"] in ("alta", "critica")


def test_gas_por_factor_mayor_a_10_es_critica():
    """Background=500, gas=10000 → 20x → crítica."""
    history = [lectura(gas_total=500), lectura(gas_total=450), lectura(gas_total=550)]
    r = lectura(gas_total=10000)
    hit = pure_detect_gas(r, history, RULES_DEFAULT)
    assert hit is not None
    assert hit["severidad"] == "critica"


def test_gas_umbral_absoluto_si_no_hay_history():
    """Sin history, el baseline es 0 → salta regla 1 → usa regla 2 (umbral absoluto)."""
    r = lectura(gas_total=6000)
    hit = pure_detect_gas(r, [], RULES_DEFAULT)
    assert hit is not None
    assert hit["tipo"] == "gas_absoluto"


def test_gas_normal_no_detecta():
    history = [lectura(gas_total=1000), lectura(gas_total=1100), lectura(gas_total=1200)]
    r = lectura(gas_total=1300)
    assert pure_detect_gas(r, history, RULES_DEFAULT) is None


# ──────────────────────────────────────────────────────────────────────────────
# Regla 2: densidad caída
# ──────────────────────────────────────────────────────────────────────────────


def test_densidad_sin_datos_no_detecta():
    assert pure_detect_densidad({"den_in": 0, "den_out": 0}, [], RULES_DEFAULT) is None


def test_densidad_caida_menor_5pct_no_detecta():
    r = lectura(den_in=1.20, den_out=1.15)  # -4.17%
    assert pure_detect_densidad(r, [], RULES_DEFAULT) is None


def test_densidad_caida_mayor_5pct_detecta_alta():
    r = lectura(den_in=1.20, den_out=1.12)  # -6.67%
    hit = pure_detect_densidad(r, [], RULES_DEFAULT)
    assert hit is not None
    assert hit["tipo"] == "densidad_caida"
    assert hit["severidad"] == "alta"


def test_densidad_caida_mayor_8pct_es_critica():
    r = lectura(den_in=1.20, den_out=1.08)  # -10%
    hit = pure_detect_densidad(r, [], RULES_DEFAULT)
    assert hit is not None
    assert hit["severidad"] == "critica"


# ──────────────────────────────────────────────────────────────────────────────
# Regla 3: ROP caída
# ──────────────────────────────────────────────────────────────────────────────


def test_rop_sin_datos_no_detecta():
    assert pure_detect_rop({"rop": 0}, [], RULES_DEFAULT) is None


def test_rop_caida_mayor_80pct_detecta():
    history = [lectura(rop=25), lectura(rop=24), lectura(rop=26)]
    r = lectura(rop=3)  # promedio 25, caída 88%
    hit = pure_detect_rop(r, history, RULES_DEFAULT)
    assert hit is not None
    assert hit["tipo"] == "rop_caida"


def test_rop_sin_history_no_detecta():
    """Sin history, no hay baseline."""
    r = lectura(rop=5)
    assert pure_detect_rop(r, [], RULES_DEFAULT) is None


def test_rop_caida_menor_80pct_no_detecta():
    history = [lectura(rop=25), lectura(rop=24), lectura(rop=26)]
    r = lectura(rop=20)  # caída 20%
    assert pure_detect_rop(r, history, RULES_DEFAULT) is None


# ──────────────────────────────────────────────────────────────────────────────
# Orquestador
# ──────────────────────────────────────────────────────────────────────────────


def test_evaluate_sin_anomalias_retorna_lista_vacia():
    r = lectura()
    history = [lectura(timestamp=f"2026-09-15T13:5{i}:00Z") for i in range(5)]
    assert pure_detect_todas(r, history, RULES_DEFAULT) == []


def test_evaluate_multiples_anomalias_a_la_vez():
    """Gas + densidad + ROP disparan en la misma lectura."""
    history = [
        lectura(rop=25, den_in=1.20, den_out=1.20, gas_total=1000,
                timestamp="2026-09-15T13:30:00Z"),
    ]
    r = lectura(rop=3, den_in=1.20, den_out=1.05, gas_total=20000,
                timestamp="2026-09-15T14:00:00Z")
    hits = pure_detect_todas(r, history, RULES_DEFAULT)
    tipos = {h["tipo"] for h in hits}
    assert "gas_pico" in tipos or "gas_absoluto" in tipos
    assert "densidad_caida" in tipos
    assert "rop_caida" in tipos


def test_evaluate_cada_hit_tiene_campos_requeridos():
    r = lectura(gas_total=20000)
    hits = pure_detect_todas(r, [], RULES_DEFAULT)
    assert len(hits) >= 1
    for hit in hits:
        assert "tipo" in hit
        assert "severidad" in hit
        assert "regla" in hit
        assert "notas" in hit
        assert "lectura" in hit
        assert hit["severidad"] in ("critica", "alta", "media", "baja")


def test_evaluate_no_falla_con_lectura_vacia():
    """Defensa: si llega una lectura sin campos, no debe explotar."""
    hits = pure_detect_todas({}, [], RULES_DEFAULT)
    assert hits == []
