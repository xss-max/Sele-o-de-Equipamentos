import * as XLSX from 'xlsx';

/**
 * Exporta a planilha completa para o Departamento de Compras
 */
export function exportToPurchasingExcel(project, equipments) {
  const wb = XLSX.utils.book_new();

  // 1. Matriz de dados para a planilha principal de Compras
  const sheetData = [
    ['CLIMAPRESS - PLANILHA DE SELEÇÃO DE EQUIPAMENTOS PARA COMPRAS'],
    ['OBRA / PROJETO:', project.projectName || ''],
    ['CLIENTE:', project.clientName || '', 'LOCAL:', project.location || ''],
    ['RESP. TÉCNICO:', project.engineerName || '', 'DATA:', project.date || '', 'REVISÃO:', project.revision || 'R00'],
    ['NOTAS GERAIS:', project.notes || ''],
    [], // linha em branco
    [
      'ITEM',
      'TAG',
      'TIPO DE EQUIPAMENTO',
      'APLICAÇÃO',
      'FABRICANTE DE REFERÊNCIA',
      'MODELO DE REFERÊNCIA',
      'TIPO DE ROTOR',
      'VAZÃO (m³/h)',
      'VAZÃO (CFM)',
      'PRESSÃO ESTÁTICA (mmca)',
      'PRESSÃO ESTÁTICA (Pa)',
      'POTÊNCIA MOTOR (CV)',
      'POTÊNCIA MOTOR (kW)',
      'TENSÃO ELÉTRICA',
      'TIPO DE PARTIDA',
      'RPM',
      'ACOPLAMENTO',
      'PROTETOR POLIAS',
      'DAMPER DESCARGA',
      'FILTRAGEM',
      'SAQUE FILTRO',
      'ROTOR ANTI-FAÍSCA',
      'MOTOR EX-PROOF',
      'RUÍDO dB(A)',
      'STATUS CONFERÊNCIA',
      'OBSERVAÇÕES PARA COTAÇÃO / COMPRAS'
    ]
  ];

  equipments.forEach((eq, index) => {
    sheetData.push([
      index + 1,
      eq.tag || `ITEM-${index + 1}`,
      eq.typeName || '',
      eq.application || '',
      eq.manufacturer || '',
      eq.model || '',
      eq.rotorType || '',
      eq.flowRateM3h || 0,
      eq.flowRateCfm || 0,
      eq.staticPressureMmca || 0,
      eq.staticPressurePa || 0,
      eq.motorPowerCv || 0,
      eq.motorPowerKw || 0,
      eq.voltage || '',
      eq.starterType || '',
      eq.rpm || 1750,
      eq.coupling || '',
      eq.hasBeltGuard ? 'SIM' : 'NÃO',
      eq.hasDamper ? 'SIM' : 'NÃO',
      eq.filterType || 'Sem Filtro',
      eq.filterSaqueSide || 'N/A',
      eq.isAntiSpark ? 'SIM' : 'NÃO',
      eq.isExplosionProof ? 'SIM' : 'NÃO',
      eq.noiseDbA ? `${eq.noiseDbA} dB(A)` : '-',
      eq.status === 'approved' ? 'APROVADO P/ COMPRAS' : eq.status === 'pending_review' ? 'EM CONFERÊNCIA' : 'RASCUNHO',
      eq.comments || ''
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Ajuste de largura das colunas
  ws['!cols'] = [
    { wch: 6 },  // Item
    { wch: 16 }, // TAG
    { wch: 28 }, // Tipo
    { wch: 32 }, // Aplicação
    { wch: 22 }, // Fabricante
    { wch: 28 }, // Modelo
    { wch: 24 }, // Rotor
    { wch: 14 }, // m³/h
    { wch: 12 }, // CFM
    { wch: 15 }, // mmca
    { wch: 14 }, // Pa
    { wch: 14 }, // CV
    { wch: 14 }, // kW
    { wch: 26 }, // Tensão
    { wch: 20 }, // Partida
    { wch: 10 }, // RPM
    { wch: 18 }, // Acoplamento
    { wch: 12 }, // Protetor
    { wch: 12 }, // Damper
    { wch: 26 }, // Filtragem
    { wch: 20 }, // Saque
    { wch: 12 }, // Anti-faísca
    { wch: 12 }, // Ex-proof
    { wch: 12 }, // Ruído
    { wch: 20 }, // Status
    { wch: 45 }  // Obs
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Equipamentos Compras');

  // 2. Aba de Resumo por Fabricante para facilitar cotações parciais
  const mfgSummary = {};
  equipments.forEach(eq => {
    const m = eq.manufacturer || 'Não Definido';
    if (!mfgSummary[m]) {
      mfgSummary[m] = { count: 0, items: [] };
    }
    mfgSummary[m].count++;
    mfgSummary[m].items.push(eq.tag);
  });

  const summaryData = [
    ['RESUMO DE COTAÇÃO POR FABRICANTE DE REFERÊNCIA'],
    ['FABRICANTE', 'QTD EQUIPAMENTOS', 'TAGS ASSOCIADOS'],
    ...Object.entries(mfgSummary).map(([mfg, data]) => [
      mfg,
      data.count,
      data.items.join(', ')
    ])
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo Fabricantes');

  // Nome do arquivo
  const safeName = (project.projectName || 'Projeto')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const fileName = `Planilha_Compras_${safeName}_${project.revision || 'R00'}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

/**
 * Exporta em formato CSV compatível com Excel (com BOM UTF-8)
 */
export function exportToPurchasingCsv(project, equipments) {
  const headers = [
    'Item',
    'TAG',
    'Tipo',
    'Aplicação',
    'Fabricante_Ref',
    'Modelo_Ref',
    'Vazao_m3h',
    'Vazao_CFM',
    'Pressao_mmca',
    'Pressao_Pa',
    'Motor_CV',
    'Motor_kW',
    'Tensao',
    'Partida',
    'Acoplamento',
    'Damper',
    'Filtros',
    'Saque_Filtro',
    'Status',
    'Observacoes'
  ];

  const rows = equipments.map((eq, i) => [
    i + 1,
    `"${eq.tag || ''}"`,
    `"${eq.typeName || ''}"`,
    `"${eq.application || ''}"`,
    `"${eq.manufacturer || ''}"`,
    `"${eq.model || ''}"`,
    eq.flowRateM3h || 0,
    eq.flowRateCfm || 0,
    eq.staticPressureMmca || 0,
    eq.staticPressurePa || 0,
    eq.motorPowerCv || 0,
    eq.motorPowerKw || 0,
    `"${eq.voltage || ''}"`,
    `"${eq.starterType || ''}"`,
    `"${eq.coupling || ''}"`,
    eq.hasDamper ? 'SIM' : 'NAO',
    `"${eq.filterType || 'Sem Filtro'}"`,
    `"${eq.filterSaqueSide || 'N/A'}"`,
    `"${eq.status}"`,
    `"${(eq.comments || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Planilha_Compras_${project.revision || 'R00'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
