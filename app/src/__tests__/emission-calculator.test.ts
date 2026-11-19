import { describe, it, expect } from 'vitest';
import {
  EMISSION_FACTORS,
  DEFAULT_SIMULATION_INPUTS,
  MONTHLY_DISTRIBUTION_SIMULATION,
  PAGE_TRANSFER_BENCHMARKS,
  calculateSipandaEmissions,
} from '../lib/emission-data';

describe('Emission Calculator & Benchmark Formulae (PRD Bab 2 & Spreadsheet)', () => {
  it('has verified constants matching academic literature', () => {
    // Ekin & Elitok (2024): 34 g CO2 per lembar A4
    expect(EMISSION_FACTORS.paperProductionGramCO2PerSheet).toBe(34);

    // Nugroho dkk. (2022) / ESDM: Jamali Grid 1.06 kg CO2e / kWh
    expect(EMISSION_FACTORS.jamaliGridKgCO2ePerKwh).toBe(1.06);

    // SWDM v4: 0.194 kWh / GB (0.055 + 0.059 + 0.080) & 494 g CO2e / kWh
    expect(EMISSION_FACTORS.swdmTotalEnergyKwhPerGB).toBe(0.194);
    expect(EMISSION_FACTORS.swdmGlobalCarbonIntensityGCO2ePerKwh).toBe(494);
  });

  it('correctly calculates baseline conventional scenario (100 proposals, 20 sheets)', () => {
    const res = calculateSipandaEmissions(100, 20, 0.5, 4, 3.9);

    // 100 * 20 = 2,000 sheets
    expect(res.conventional.totalSheets).toBe(2000);

    // 2,000 * 34g = 68,000g = 68.0 kg CO2
    expect(res.conventional.paperEmissionKg).toBe(68);

    // 0.5 kWh * 1.06 kg CO2e/kWh = 0.53 kg CO2e
    expect(res.conventional.printerEmissionKg).toBe(0.53);

    // Total cost saved: 2,000 sheets * Rp 500 = Rp 1,000,000
    expect(res.conventional.totalCostSavedIdr).toBe(1000000);
  });

  it('correctly calculates digital SIPANDA operational emissions via SWDM v4', () => {
    const res = calculateSipandaEmissions(100, 20, 0.5, 4, 3.9);

    // Total access: 100 * 4 = 400
    expect(res.digital.totalAccess).toBe(400);

    // Data transfer: 400 * 3.9 MB / 1024 = 1.5234 GB
    expect(res.digital.totalTransferGB).toBeCloseTo(1.5234, 3);

    // Total digital energy: 1.5234 * 0.194 kWh = ~0.2955 kWh
    expect(res.digital.energyKwh).toBeGreaterThan(0.2);
    expect(res.digital.energyKwh).toBeLessThan(0.35);

    // Total digital emissions
    expect(res.digital.emissionKg).toBeGreaterThan(0.1);
    expect(res.digital.emissionKg).toBeLessThan(0.2);

    // Numeric comparison reduction percentage should be > 99%
    expect(res.comparison.differencePercentage).toBeGreaterThan(99);
  });

  it('scales accurately when user inputs change dynamically', () => {
    // If scaled to 200 proposals and 30 sheets
    const res = calculateSipandaEmissions(200, 30, 1.0, 4, 3.9);
    expect(res.conventional.totalSheets).toBe(6000);
    // 6,000 * 34g = 204 kg CO2
    expect(res.conventional.paperEmissionKg).toBe(204);
  });

  it('validates page transfer benchmarks meet Green Software criteria (< 1.0 MB/page)', () => {
    for (const benchmark of PAGE_TRANSFER_BENCHMARKS) {
      expect(benchmark.transferMB).toBeLessThanOrEqual(1.0);
      expect(benchmark.desc.length).toBeGreaterThan(5);
    }
  });

  it('ensures monthly distribution simulation totals 100% of baseline volume', () => {
    const totalApplications = MONTHLY_DISTRIBUTION_SIMULATION.reduce(
      (sum, m) => sum + m.applications,
      0
    );
    expect(totalApplications).toBe(100);
  });
});
