// Conversões e estimativas rápidas de engenharia HVAC

export function m3hToCfm(m3h) {
  if (!m3h || isNaN(m3h)) return 0;
  return Math.round(m3h / 1.699);
}

export function cfmToM3h(cfm) {
  if (!cfm || isNaN(cfm)) return 0;
  return Math.round(cfm * 1.699);
}

export function mmcaToPa(mmca) {
  if (!mmca || isNaN(mmca)) return 0;
  return Math.round(mmca * 9.80665);
}

export function paToMmca(pa) {
  if (!pa || isNaN(pa)) return 0;
  return Number((pa / 9.80665).toFixed(1));
}

export function cvToKw(cv) {
  if (!cv || isNaN(cv)) return 0;
  return Number((cv * 0.735499).toFixed(2));
}

export function kwToCv(kw) {
  if (!kw || isNaN(kw)) return 0;
  return Number((kw / 0.735499).toFixed(2));
}

/**
 * Estima a potência no eixo e motor comercial sugerido
 * Potência Hidráulica = (Vazão m³/s * Pressão Pa) / Eficiência
 */
export function estimateRequiredPower(m3h, mmca, fanEfficiency = 0.65) {
  if (!m3h || !mmca) return { shaftPowerCv: 0, suggestedMotorCv: 0, safetyMarginPct: 0 };
  
  const q_m3s = m3h / 3600;
  const p_pa = mmca * 9.80665;
  const airPowerWatts = q_m3s * p_pa;
  
  const shaftWatts = airPowerWatts / fanEfficiency;
  const shaftCv = shaftWatts / 735.5;
  
  // Sugestão de motor comercial com margem padrão (15% a 20%)
  const standardMotorsCv = [
    0.25, 0.33, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 7.5, 10.0, 12.5, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0, 60.0, 75.0, 100.0
  ];
  
  const targetWithMargin = shaftCv * 1.20;
  const suggestedMotor = standardMotorsCv.find(m => m >= targetWithMargin) || Math.ceil(targetWithMargin);
  const marginPct = shaftCv > 0 ? Math.round(((suggestedMotor - shaftCv) / shaftCv) * 100) : 0;
  
  return {
    shaftPowerCv: Number(shaftCv.toFixed(2)),
    suggestedMotorCv: suggestedMotor,
    safetyMarginPct: marginPct
  };
}

/**
 * Validação de segurança da folha de dados do equipamento
 */
export function auditEquipment(equipment) {
  const issues = [];
  const warnings = [];
  const checks = [];

  const m3h = Number(equipment.flowRateM3h) || 0;
  const mmca = Number(equipment.staticPressureMmca) || 0;
  const motorCv = Number(equipment.motorPowerCv) || 0;

  // 1. Checagem de Vazão e Pressão
  if (m3h <= 0) {
    issues.push('Vazão de ar inválida ou zerada.');
  } else {
    checks.push(`Vazão definida: ${m3h.toLocaleString('pt-BR')} m³/h (${m3hToCfm(m3h).toLocaleString('pt-BR')} CFM).`);
  }

  if (mmca <= 0) {
    issues.push('Pressão estática inválida ou zerada.');
  } else {
    checks.push(`Pressão estática definida: ${mmca} mmca (${mmcaToPa(mmca)} Pa).`);
  }

  // 2. Análise de Potência do Motor e Folga de Sobrecarga
  if (m3h > 0 && mmca > 0) {
    const { shaftPowerCv, suggestedMotorCv } = estimateRequiredPower(m3h, mmca);
    if (motorCv < shaftPowerCv) {
      issues.push(`Motor subdimensionado (${motorCv} CV). Potência estimada no eixo é ${shaftPowerCv} CV. Risco de desarme térmico!`);
    } else if (motorCv < shaftPowerCv * 1.10) {
      warnings.push(`Margem de potência muito justa (<10%). Recomendado motor comercial de ao menos ${suggestedMotorCv} CV.`);
    } else {
      checks.push(`Potência de motor adequada (${motorCv} CV vs ${shaftPowerCv} CV no eixo, margem segura).`);
    }
  }

  // 3. Regra de Partida de Motor (Normas elétricas concessionárias / quadros)
  if (motorCv >= 5.0 && equipment.starterType === 'Partida Direta') {
    warnings.push(`Motores a partir de 5 CV em partida direta podem provocar queda de tensão na rede. Recomenda-se Inversor, Soft-Starter ou Estrela-Triângulo.`);
  }

  // 4. Checagem de Transmissão e Protetor de Polias
  if (equipment.coupling === 'Polias e Correias' && !equipment.hasBeltGuard) {
    issues.push('NR-12: Obrigatório protetor de transmissão para acoplamento por polias e correias.');
  }

  // 5. Equipamentos em Áreas Inflamáveis / Cozinhas
  if (equipment.application && equipment.application.includes('Gordura') && equipment.isAntiSpark === false) {
    warnings.push('Para exaustão de cozinhas e vapores inflamáveis, avaliar necessidade de rotor anti-faísca.');
  }

  // 6. Pressurização de Escadas
  if (equipment.application && equipment.application.includes('Pressurização') && !equipment.hasDamper) {
    warnings.push('Sistemas de pressurização de escada exigem damper de sobrepressão / contrafluxo na descarga.');
  }

  // 7. Caixas de ventilação sem lado de saque especificado
  if (equipment.typeId === 'caixa_ventilacao' && equipment.filterType !== 'Sem Filtro' && !equipment.filterSaqueSide) {
    warnings.push('Definir o lado para saque do filtro para garantir acesso na manutenção predial.');
  }

  const isCompliant = issues.length === 0;

  return {
    isCompliant,
    issues,
    warnings,
    checks,
    score: Math.max(0, 100 - (issues.length * 30) - (warnings.length * 10))
  };
}
