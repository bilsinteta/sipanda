/**
 * Data and calculations replicated from:
 * Spreadsheet CO2e SIPANDA.xlsx & PRD SIPANDA
 * 
 * References:
 * 1. Ekin, M., & Elitok, Y. (2024). "Evaluation of EDMS usage in terms of environmental sustainability."
 *    Global Energy, 1(2), 11-15. -> Factor: 34 g CO2 per A4 sheet paper production.
 * 2. Nugroho, R., et al. (2022). "Life cycle inventories and life cycle assessment for an electricity grid network:
 *    case study of the Jamali grid, Indonesia." Int J LCA, 27(8), 1081-1091. -> Factor: 1.06 kg CO2e/kWh.
 * 3. Sustainable Web Design Model (SWDM v4):
 *    - Data Center: 0.055 kWh/GB
 *    - Network: 0.059 kWh/GB
 *    - User Device: 0.080 kWh/GB
 *    - Total Energy: 0.194 kWh/GB
 *    - Global Grid Carbon Intensity: 494 g CO2e/kWh
 */

export const EMISSION_FACTORS = {
  paperProductionGramCO2PerSheet: 34, // g CO2/sheet
  jamaliGridKgCO2ePerKwh: 1.06, // kg CO2e/kWh
  swdmDataCenterKwhPerGB: 0.055,
  swdmNetworkKwhPerGB: 0.059,
  swdmDeviceKwhPerGB: 0.080,
  swdmTotalEnergyKwhPerGB: 0.194, // 0.055 + 0.059 + 0.080
  swdmGlobalCarbonIntensityGCO2ePerKwh: 494, // g CO2e/kWh
  costPerSheetPrintingIdr: 500, // Rp 500 average print cost per page
} as const;

export const DEFAULT_SIMULATION_INPUTS = {
  applicationsPerYear: 100,
  sheetsPerApplication: 20,
  annualPrinterElectricityKwh: 0.5,
  digitalAccessCyclesPerApplication: 4,
  dataTransferMBPerAccess: 4.0, // MB per cycle
} as const;

export const MONTHLY_DISTRIBUTION_SIMULATION = [
  { month: 'Januari', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Februari', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Maret', applications: 9, sheets: 180, paperKgCO2: 6.12, transferGB: 0.1406, digitalKgCO2e: 0.01348 },
  { month: 'April', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Mei', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Juni', applications: 9, sheets: 180, paperKgCO2: 6.12, transferGB: 0.1406, digitalKgCO2e: 0.01348 },
  { month: 'Juli', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Agustus', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'September', applications: 9, sheets: 180, paperKgCO2: 6.12, transferGB: 0.1406, digitalKgCO2e: 0.01348 },
  { month: 'Oktober', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'November', applications: 8, sheets: 160, paperKgCO2: 5.44, transferGB: 0.125, digitalKgCO2e: 0.01198 },
  { month: 'Desember', applications: 9, sheets: 180, paperKgCO2: 6.12, transferGB: 0.1406, digitalKgCO2e: 0.01348 },
] as const;

export const PAGE_TRANSFER_BENCHMARKS = [
  { page: 'Login & Autentikasi', transferMB: 0.5, desc: 'Login token, lightweight layout' },
  { page: 'Dashboard Mahasiswa', transferMB: 0.8, desc: 'Statistik, list pengajuan aktif' },
  { page: 'Form Pengajuan & Upload', transferMB: 1.0, desc: 'Payload metadata & dokumen proposal' },
  { page: 'Halaman Verifikasi & Review', transferMB: 0.7, desc: 'Data pengajuan, catatan revisi' },
  { page: 'Arsip & LPJ Digital', transferMB: 1.0, desc: 'Tabel arsip riwayat & dokumen akhir' },
] as const;

/**
 * Calculate conventional vs digital emissions dynamically based on custom user inputs
 */
export function calculateSipandaEmissions(
  appsPerYear: number = DEFAULT_SIMULATION_INPUTS.applicationsPerYear,
  sheetsPerApp: number = DEFAULT_SIMULATION_INPUTS.sheetsPerApplication,
  printerKwh: number = DEFAULT_SIMULATION_INPUTS.annualPrinterElectricityKwh,
  accessPerApp: number = DEFAULT_SIMULATION_INPUTS.digitalAccessCyclesPerApplication,
  mbPerAccess: number = DEFAULT_SIMULATION_INPUTS.dataTransferMBPerAccess
) {
  // Conventional Scenario
  const totalSheets = appsPerYear * sheetsPerApp;
  const paperEmissionKg = (totalSheets * EMISSION_FACTORS.paperProductionGramCO2PerSheet) / 1000;
  const printerEmissionKg = printerKwh * EMISSION_FACTORS.jamaliGridKgCO2ePerKwh;
  const totalCostSavedIdr = totalSheets * EMISSION_FACTORS.costPerSheetPrintingIdr;

  // Digital Scenario (SWDM v4)
  const totalAccess = appsPerYear * accessPerApp;
  const totalTransferGB = (totalAccess * mbPerAccess) / 1024;
  const energyKwh = totalTransferGB * EMISSION_FACTORS.swdmTotalEnergyKwhPerGB;
  const digitalEmissionKg = (energyKwh * EMISSION_FACTORS.swdmGlobalCarbonIntensityGCO2ePerKwh) / 1000;
  const emissionPerAccessKg = totalAccess > 0 ? digitalEmissionKg / totalAccess : 0;

  // Comparative illustration (with strict methodological note from PRD & Spreadsheet)
  const differencePercentage = paperEmissionKg > 0
    ? ((paperEmissionKg - digitalEmissionKg) / paperEmissionKg) * 100
    : 0;

  return {
    totalApplications: appsPerYear,
    conventional: {
      totalSheets,
      paperEmissionKg: Number(paperEmissionKg.toFixed(2)),
      printerElectricityKwh: printerKwh,
      printerEmissionKg: Number(printerEmissionKg.toFixed(3)),
      totalCostSavedIdr,
    },
    digital: {
      totalAccess,
      totalTransferGB: Number(totalTransferGB.toFixed(4)),
      energyKwh: Number(energyKwh.toFixed(4)),
      emissionKg: Number(digitalEmissionKg.toFixed(4)),
      emissionPerAccessKg: Number(emissionPerAccessKg.toFixed(6)),
    },
    comparison: {
      differencePercentage: Number(differencePercentage.toFixed(2)),
      warningNote:
        'Peringatan Metodologis (Sesuai PRD & Spreadsheet): Emisi produksi kertas (kg CO₂) dan emisi listrik/digital (kg CO₂e) memiliki kategori dan batas sistem yang berbeda. Persentase selisih disajikan sebagai perbandingan numerik ilustratif, bukan klaim reduksi mutlak tanpa batasan sistem yang setara.',
    },
  };
}

