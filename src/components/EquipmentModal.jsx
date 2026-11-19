import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Wind,
  Gauge,
  Zap,
  Filter,
  Shield,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import {
  EQUIPMENT_TYPES,
  APPLICATION_OPTIONS,
  VOLTAGE_OPTIONS,
  STARTER_OPTIONS,
  FILTER_TYPES,
  FILTER_SAQUE_OPTIONS,
  MOUNTING_DISCHARGE_POSITIONS
} from '../data/equipmentTypes';
import { MANUFACTURERS } from '../data/manufacturers';
import {
  m3hToCfm,
  cfmToM3h,
  mmcaToPa,
  paToMmca,
  cvToKw,
  kwToCv,
  estimateRequiredPower,
  auditEquipment
} from '../utils/calculations';

export default function EquipmentModal({
  isOpen,
  onClose,
  onSave,
  equipmentToEdit,
  allEquipments
}) {
  const [formData, setFormData] = useState({
    tag: '',
    typeId: 'caixa_ventilacao',
    typeName: 'Caixa de Ventilação / Ar Externo',
    application: APPLICATION_OPTIONS[0],
    flowRateM3h: 3000,
    flowRateCfm: 1766,
    staticPressureMmca: 30,
    staticPressurePa: 294,
    manufacturer: 'Projelmec',
    model: '',
    rotorType: 'Limit Load (Pás p/ Trás)',
    motorPowerCv: 3.0,
    motorPowerKw: 2.2,
    voltage: VOLTAGE_OPTIONS[0],
    starterType: STARTER_OPTIONS[0],
    rpm: 1750,
    coupling: 'Polias e Correias',
    hasBeltGuard: true,
    isExplosionProof: false,
    isAntiSpark: false,
    motorProtection: 'IP-55',
    paintType: 'Padrão Fabricante',
    filterType: 'Filtro G4 (Descartável Plano)',
    filterThicknessMm: 50,
    filterSaqueSide: FILTER_SAQUE_OPTIONS[0],
    hasDamper: false,
    dischargePosition: MOUNTING_DISCHARGE_POSITIONS[0],
    noiseDbA: 65,
    status: 'pending_review',
    comments: ''
  });

  const [activeTab, setActiveTab] = useState('identification'); // 'identification', 'aerodynamics', 'electrical', 'mechanics'

  useEffect(() => {
    if (equipmentToEdit) {
      setFormData({ ...equipmentToEdit });
    } else {
      // Gerar TAG sugerido automático
      const prefix = 'VAE';
      const count = allEquipments.length + 1;
      const suggestedTag = `${prefix}-01-0${count}`;
      setFormData(prev => ({
        ...prev,
        tag: suggestedTag,
        flowRateM3h: 3000,
        flowRateCfm: m3hToCfm(3000),
        staticPressureMmca: 30,
        staticPressurePa: mmcaToPa(30),
        motorPowerCv: 3.0,
        motorPowerKw: cvToKw(3.0),
        status: 'pending_review'
      }));
    }
  }, [equipmentToEdit, isOpen]);

  if (!isOpen) return null;

  // Lógica quando o tipo de equipamento muda
  const handleTypeChange = (typeId) => {
    const selected = EQUIPMENT_TYPES.find(t => t.id === typeId);
    if (!selected) return;

    let updated = {
      ...formData,
      typeId: selected.id,
      typeName: selected.name,
      rotorType: selected.typicalRotors[0] || 'Airfoil'
    };

    // Ajusta o TAG se for novo cadastro
    if (!equipmentToEdit) {
      const count = allEquipments.filter(e => e.typeId === typeId).length + 1;
      updated.tag = `${selected.tagPrefix}-01-${count < 10 ? '0' + count : count}`;
    }

    if (selected.id === 'pressurizacao_escada') {
      updated.application = 'Pressurização de Escadas de Emergência';
      updated.hasDamper = true;
      updated.starterType = 'Inversor de Frequência (VFD)';
    }

    setFormData(updated);
  };

  // Conversões automáticas ao digitar
  const handleM3hChange = (val) => {
    const m3h = Number(val) || 0;
    const cfm = m3hToCfm(m3h);
    const est = estimateRequiredPower(m3h, formData.staticPressureMmca);
    setFormData(prev => ({
      ...prev,
      flowRateM3h: val,
      flowRateCfm: cfm,
      motorPowerCv: prev.motorPowerCv || est.suggestedMotorCv,
      motorPowerKw: cvToKw(prev.motorPowerCv || est.suggestedMotorCv)
    }));
  };

  const handleCfmChange = (val) => {
    const cfm = Number(val) || 0;
    const m3h = cfmToM3h(cfm);
    setFormData(prev => ({
      ...prev,
      flowRateCfm: val,
      flowRateM3h: m3h
    }));
  };

  const handleMmcaChange = (val) => {
    const mmca = Number(val) || 0;
    const pa = mmcaToPa(mmca);
    setFormData(prev => ({
      ...prev,
      staticPressureMmca: val,
      staticPressurePa: pa
    }));
  };

  const handlePaChange = (val) => {
    const pa = Number(val) || 0;
    const mmca = paToMmca(pa);
    setFormData(prev => ({
      ...prev,
      staticPressurePa: val,
      staticPressureMmca: mmca
    }));
  };

  const handleCvChange = (val) => {
    const cv = Number(val) || 0;
    setFormData(prev => ({
      ...prev,
      motorPowerCv: val,
      motorPowerKw: cvToKw(cv)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tag.trim()) {
      alert('Por favor, informe a identificação / TAG do equipamento.');
      return;
    }
    onSave(formData);
  };

  // Cálculos dinâmicos em tempo real
  const currentEstimate = estimateRequiredPower(
    Number(formData.flowRateM3h) || 0,
    Number(formData.staticPressureMmca) || 0
  );
  const audit = auditEquipment(formData);

  const selectedMfg = MANUFACTURERS.find(m => m.name === formData.manufacturer) || MANUFACTURERS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                {equipmentToEdit ? 'Editar Especificação' : 'Nova Seleção'}
              </span>
              <span className="font-mono text-sm font-bold text-slate-300">
                {formData.tag}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {formData.typeName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
          {[
            { id: 'identification', label: '1. Identificação & Fabricante' },
            { id: 'aerodynamics', label: '2. Vazão & Pressão' },
            { id: 'electrical', label: '3. Motorização & Elétrica' },
            { id: 'mechanics', label: '4. Transmissão & Acessórios' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-700 bg-white/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: IDENTIFICAÇÃO */}
          {activeTab === 'identification' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    TAG do Equipamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
                    placeholder="EX: VAE-1SS-01-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Identificador unívoco do projeto</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Equipamento HVAC
                  </label>
                  <select
                    value={formData.typeId}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Finalidade / Sistema / Aplicação
                </label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {APPLICATION_OPTIONS.map(app => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fabricante de Referência
                  </label>
                  <select
                    value={formData.manufacturer}
                    onChange={(e) => {
                      const mfg = MANUFACTURERS.find(m => m.name === e.target.value);
                      setFormData({
                        ...formData,
                        manufacturer: e.target.value,
                        model: mfg && mfg.models[0] ? mfg.models[0] : ''
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {MANUFACTURERS.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Modelo de Referência / Linha
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ex: CV-PL / CRMT / Modelo sob consulta"
                    list="model-suggestions"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <datalist id="model-suggestions">
                    {selectedMfg.models.map((mod, idx) => (
                      <option key={idx} value={mod} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Rotor
                </label>
                <input
                  type="text"
                  value={formData.rotorType}
                  onChange={(e) => setFormData({ ...formData, rotorType: e.target.value })}
                  placeholder="Ex: Limit Load / Airfoil / Backward"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status de Conferência & Aprovação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'draft', label: 'Rascunho' },
                    { id: 'pending_review', label: 'Em Conferência' },
                    { id: 'approved', label: 'Aprovado Compras' }
                  ].map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st.id })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        formData.status === st.id
                          ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AERODINÂMICA (VAZÃO & PRESSÃO) */}
          {activeTab === 'aerodynamics' && (
            <div className="space-y-5">
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-900">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Conversão instantânea:</span> Ao digitar a vazão em <span className="font-mono font-bold">m³/h</span> ou a pressão em <span className="font-mono font-bold">mmca</span>, as unidades em <span className="font-mono font-bold">CFM</span> e <span className="font-mono font-bold">Pa</span> são atualizadas automaticamente.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vazão m³/h */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Vazão de Ar (m³/h) *</span>
                    <span className="text-sky-600 font-bold">Padrão ABNT</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={formData.flowRateM3h}
                      onChange={(e) => handleM3hChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">m³/h</span>
                  </div>
                </div>

                {/* Vazão CFM */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Vazão de Ar (CFM)</span>
                    <span className="text-slate-400 font-bold">ASHRAE</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={formData.flowRateCfm}
                      onChange={(e) => handleCfmChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">CFM</span>
                  </div>
                </div>

                {/* Pressão Estática mmca */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Pressão Estática (mmca) *</span>
                    <span className="text-indigo-600 font-bold">Usual Brasil</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="0.1"
                      value={formData.staticPressureMmca}
                      onChange={(e) => handleMmcaChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">mmca</span>
                  </div>
                </div>

                {/* Pressão Estática Pa */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Pressão Estática (Pa)</span>
                    <span className="text-slate-400 font-bold">SI (Pascal)</span>
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={formData.staticPressurePa}
                      onChange={(e) => handlePaChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-base font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400">Pa</span>
                  </div>
                </div>
              </div>

              {/* Ruído */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nível de Pressão Sonora Admissível dB(A)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="45"
                    max="95"
                    step="1"
                    value={formData.noiseDbA || 65}
                    onChange={(e) => setFormData({ ...formData, noiseDbA: Number(e.target.value) })}
                    className="flex-1 accent-sky-600"
                  />
                  <span className="w-20 text-center font-mono font-black text-sm bg-white border border-slate-300 py-1.5 rounded-lg text-slate-800">
                    {formData.noiseDbA} dB(A)
                  </span>
                </div>
              </div>

              {/* Pré-cálculo da Engenharia */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    Estimativa Hidráulica da Carga
                  </span>
                  <span className="text-xs text-emerald-700">
                    Potência no eixo calculada: <strong>{currentEstimate.shaftPowerCv} CV</strong> (rendimento médio 65%).
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-800 block">Sugestão Motor Comercial:</span>
                  <span className="text-base font-extrabold text-emerald-950 font-mono">
                    {currentEstimate.suggestedMotorCv} CV (+{currentEstimate.safetyMarginPct}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOTORIZAÇÃO & ELÉTRICA */}
          {activeTab === 'electrical' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Potência do Motor (CV) *</span>
                    <button
                      type="button"
                      onClick={() => handleCvChange(currentEstimate.suggestedMotorCv)}
                      className="text-[11px] text-sky-600 hover:text-sky-800 font-bold underline"
                    >
                      Aplicar Sugestão ({currentEstimate.suggestedMotorCv} CV)
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0.25"
                      step="0.25"
                      value={formData.motorPowerCv}
                      onChange={(e) => handleCvChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">CV</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Potência Equivalente (kW)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.motorPowerKw}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-600 cursor-not-allowed"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">kW</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tensão de Alimentação
                  </label>
                  <select
                    value={formData.voltage}
                    onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {VOLTAGE_OPTIONS.map(v => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Partida
                  </label>
                  <select
                    value={formData.starterType}
                    onChange={(e) => setFormData({ ...formData, starterType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {STARTER_OPTIONS.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rotação do Motor (RPM)
                  </label>
                  <select
                    value={formData.rpm}
                    onChange={(e) => setFormData({ ...formData, rpm: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={1750}>1750 RPM (4 Polos - Padrão)</option>
                    <option value={3500}>3500 RPM (2 Polos)</option>
                    <option value={1150}>1150 RPM (6 Polos)</option>
                    <option value={850}>850 RPM (8 Polos - Baixo Ruído)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Grau de Proteção Mecânica
                  </label>
                  <select
                    value={formData.motorProtection}
                    onChange={(e) => setFormData({ ...formData, motorProtection: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="IP-55">IP-55 (Blindado Industrial Padrão)</option>
                    <option value="IP-56">IP-56 (Ambientes Úmidos / Agressivos)</option>
                    <option value="IP-65">IP-65 (Totalmente Estanque)</option>
                    <option value="IP-21">IP-21 (Aberto Monofásico)</option>
                  </select>
                </div>
              </div>

              {/* Opções de Segurança Elétrica */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.isExplosionProof}
                    onChange={(e) => setFormData({ ...formData, isExplosionProof: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Motor à Prova de Explosão (Ex-d)</span>
                    <span className="text-[11px] text-slate-500">Exigido para ambientes com gases inflamáveis, tintas ou combustíveis (Norma ABNT IEC).</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: MECÂNICA & FILTRAGEM */}
          {activeTab === 'mechanics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Acoplamento / Transmissão
                  </label>
                  <select
                    value={formData.coupling}
                    onChange={(e) => setFormData({ ...formData, coupling: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Polias e Correias">Polias e Correias (Transmissão Indireta)</option>
                    <option value="Acoplamento Direto">Acoplamento Direto no Eixo (Plug Fan)</option>
                    <option value="Acoplamento Flexível">Acoplamento com Luva Elástica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Posição de Montagem & Descarga
                  </label>
                  <select
                    value={formData.dischargePosition}
                    onChange={(e) => setFormData({ ...formData, dischargePosition: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {MOUNTING_DISCHARGE_POSITIONS.map(pos => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seção de Filtros (especial para caixas de ventilação) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Estágio de Filtragem do Ar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Classe de Filtragem
                    </label>
                    <select
                      value={formData.filterType}
                      onChange={(e) => setFormData({ ...formData, filterType: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900"
                    >
                      {FILTER_TYPES.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Espessura do Porta-Filtro
                    </label>
                    <select
                      value={formData.filterThicknessMm}
                      onChange={(e) => setFormData({ ...formData, filterThicknessMm: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900"
                    >
                      <option value={25}>25 mm (1 polegada)</option>
                      <option value={50}>50 mm (2 polegadas)</option>
                      <option value={100}>100 mm (4 polegadas)</option>
                      <option value={0}>N/A (Sem Filtro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Lado de Saque do Filtro
                    </label>
                    <select
                      value={formData.filterSaqueSide}
                      onChange={(e) => setFormData({ ...formData, filterSaqueSide: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900"
                    >
                      {FILTER_SAQUE_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Itens de Segurança & Acessórios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasBeltGuard}
                    onChange={(e) => setFormData({ ...formData, hasBeltGuard: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Protetor Polias / NR-12</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasDamper}
                    onChange={(e) => setFormData({ ...formData, hasDamper: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Damper de Descarga</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.isAntiSpark}
                    onChange={(e) => setFormData({ ...formData, isAntiSpark: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Rotor Anti-Faísca</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notas de Engenharia & Observações para Compras
                </label>
                <textarea
                  rows="3"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Ex: Fornecer com contra-flanges lisas, amortecedores de vibração mola helicoidal e chave seccionadora de segurança."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* Validation Box on Footer */}
          {(audit.issues.length > 0 || audit.warnings.length > 0) && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Conferência Prévia de Segurança:
              </span>
              {audit.issues.map((err, i) => (
                <div key={i} className="text-rose-700 font-medium pl-5">• {err}</div>
              ))}
              {audit.warnings.map((warn, i) => (
                <div key={i} className="text-amber-800 pl-5">• {warn}</div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-sky-500/20 active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4 stroke-[3]" />
              <span>Salvar Especificação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
