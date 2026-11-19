import React from 'react';
import {
  Fan,
  Wind,
  Gauge,
  Zap,
  Filter,
  Layers,
  Copy,
  Edit2,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { auditEquipment } from '../utils/calculations';

export default function EquipmentCard({
  equipment,
  onEdit,
  onDuplicate,
  onDelete,
  onViewDataSheet
}) {
  const audit = auditEquipment(equipment);

  const getStatusBadge = () => {
    switch (equipment.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Aprovado Compras
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Em Conferência
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
            Rascunho
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-slate-900 tracking-tight bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                {equipment.tag || 'SEM TAG'}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1">
              {equipment.typeName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {equipment.application || 'Aplicação não informada'}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {equipment.manufacturer || 'Fabricante N/D'}
            </span>
            <div className="text-[11px] font-mono text-slate-500 mt-1 line-clamp-1">
              {equipment.model || 'Modelo sob consulta'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Specs Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white">
        
        {/* Vazão */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <Wind className="w-3.5 h-3.5 text-sky-500" />
            <span>Vazão de Ar</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            {Number(equipment.flowRateM3h || 0).toLocaleString('pt-BR')}{' '}
            <span className="text-[10px] text-slate-500 font-normal">m³/h</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {Number(equipment.flowRateCfm || 0).toLocaleString('pt-BR')} CFM
          </div>
        </div>

        {/* Pressão Estática */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pressão Estática</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            {equipment.staticPressureMmca || 0}{' '}
            <span className="text-[10px] text-slate-500 font-normal">mmca</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {equipment.staticPressurePa || 0} Pa
          </div>
        </div>

        {/* Motor Elétrico */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Motor Elétrico</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900">
            {equipment.motorPowerCv || 0}{' '}
            <span className="text-[10px] text-slate-500 font-normal">CV</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {equipment.motorPowerKw || 0} kW • {equipment.rpm || 1750} RPM
          </div>
        </div>
      </div>

      {/* Details & Tags Pills */}
      <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
          {equipment.coupling}
        </span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
          {equipment.voltage}
        </span>
        {equipment.filterType && equipment.filterType !== 'Sem Filtro' && (
          <span className="px-2 py-0.5 bg-teal-50 text-teal-800 rounded-md font-medium border border-teal-200 flex items-center gap-1">
            <Filter className="w-3 h-3 text-teal-600" />
            {equipment.filterType}
          </span>
        )}
        {equipment.hasDamper && (
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md font-medium border border-indigo-200">
            Damper Descarga
          </span>
        )}
        {equipment.isAntiSpark && (
          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded-md font-semibold border border-rose-200">
            Rotor Anti-Faísca
          </span>
        )}
      </div>

      {/* Audit Warnings strip if any */}
      {(audit.issues.length > 0 || audit.warnings.length > 0) && (
        <div className="px-4 py-2 bg-amber-50/80 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            {audit.issues.length > 0 ? `${audit.issues.length} alerta(s) de segurança` : `${audit.warnings.length} observação técnica`}
          </span>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-200/50 px-1.5 py-0.5 rounded">
            Score: {audit.score}%
          </span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDataSheet(equipment)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5 text-sky-600" />
          <span>Folha de Dados</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(equipment)}
            title="Duplicar Equipamento"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(equipment)}
            title="Editar Especificação"
            className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(equipment.id)}
            title="Excluir Equipamento"
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
