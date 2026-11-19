import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Check,
  ArrowRight
} from 'lucide-react';
import { auditEquipment } from '../utils/calculations';

export default function ChecklistDrawer({
  isOpen,
  onClose,
  equipments,
  onApproveAll,
  onSelectEquipment
}) {
  if (!isOpen) return null;

  const auditedList = equipments.map(eq => ({
    equipment: eq,
    audit: auditEquipment(eq)
  }));

  const allCompliant = auditedList.every(item => item.audit.isCompliant);
  const totalIssues = auditedList.reduce((acc, item) => acc + item.audit.issues.length, 0);
  const totalWarnings = auditedList.reduce((acc, item) => acc + item.audit.warnings.length, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Conferência de Folhas de Dados
              </h2>
              <p className="text-xs text-slate-400">
                Auditoria de segurança antes de liberar para compras
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Status Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            {allCompliant ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% dos Itens Conformes
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                {totalIssues} Ponto(s) Crítico(s)
              </span>
            )}
            {totalWarnings > 0 && (
              <span className="text-amber-800 font-medium">
                {totalWarnings} observações técnicas
              </span>
            )}
          </div>

          <button
            onClick={onApproveAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Aprovar Todos</span>
          </button>
        </div>

        {/* Equipment Audit List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {auditedList.map(({ equipment, audit }) => (
            <div
              key={equipment.id}
              className={`p-4 rounded-2xl border transition-all ${
                audit.issues.length > 0
                  ? 'bg-rose-50/40 border-rose-200'
                  : audit.warnings.length > 0
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {equipment.tag}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {equipment.typeName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {equipment.manufacturer} • {equipment.model || 'Modelo sob consulta'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    equipment.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {equipment.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </span>
                  <button
                    onClick={() => {
                      onSelectEquipment(equipment);
                      onClose();
                    }}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    title="Editar Equipamento"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Issues */}
              {audit.issues.length > 0 && (
                <div className="space-y-1 mt-2 text-xs text-rose-800 bg-rose-100/70 p-2.5 rounded-xl border border-rose-200">
                  <span className="font-bold block flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    Atenção Crítica:
                  </span>
                  {audit.issues.map((err, i) => (
                    <div key={i} className="pl-4 font-medium">• {err}</div>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {audit.warnings.length > 0 && (
                <div className="space-y-1 mt-2 text-xs text-amber-800 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200">
                  <span className="font-bold block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Recomendação de Engenharia:
                  </span>
                  {audit.warnings.map((warn, i) => (
                    <div key={i} className="pl-4 font-medium">• {warn}</div>
                  ))}
                </div>
              )}

              {/* Safe Checks */}
              {audit.issues.length === 0 && audit.warnings.length === 0 && (
                <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Dados de cálculo e motorização conferidos e seguros.
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total de {equipments.length} equipamento(s) no lote
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Concluir Conferência
          </button>
        </div>

      </div>
    </div>
  );
}
