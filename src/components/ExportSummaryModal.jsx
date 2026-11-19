import React from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Building2,
  Zap,
  Wind,
  CheckCircle2,
  Printer,
  FileText
} from 'lucide-react';
import { exportToPurchasingExcel, exportToPurchasingCsv } from '../utils/excelExporter';

export default function ExportSummaryModal({
  isOpen,
  onClose,
  project,
  equipments
}) {
  if (!isOpen) return null;

  // Estatísticas do lote
  const totalEquipments = equipments.length;
  const totalM3h = equipments.reduce((acc, eq) => acc + (Number(eq.flowRateM3h) || 0), 0);
  const totalKw = equipments.reduce((acc, eq) => acc + (Number(eq.motorPowerKw) || 0), 0);
  const totalCv = equipments.reduce((acc, eq) => acc + (Number(eq.motorPowerCv) || 0), 0);

  // Agrupamento por Fabricante
  const mfgCounts = {};
  equipments.forEach(eq => {
    const m = eq.manufacturer || 'Não Definido';
    mfgCounts[m] = (mfgCounts[m] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Exportar Lote para o Depto. de Compras
              </h2>
              <p className="text-xs text-slate-400">
                Gere arquivos padronizados para cotação com os fornecedores
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

        {/* Project Summary Banner */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Equipamentos</span>
              <span className="text-xl font-black text-slate-900">{totalEquipments}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Vazão Total</span>
              <span className="text-xl font-black text-sky-600">{totalM3h.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-400 block font-medium">m³/h</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Potência Total</span>
              <span className="text-xl font-black text-amber-600">{totalCv.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block font-medium">CV ({totalKw.toFixed(1)} kW)</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Revisão</span>
              <span className="text-xl font-black text-slate-900">{project.revision || 'R00'}</span>
            </div>
          </div>

          {/* Fabricantes no Lote */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Distribuição por Fabricante de Referência:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(mfgCounts).map(([mfg, count]) => (
                <span
                  key={mfg}
                  className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800 border border-slate-200 flex items-center gap-1.5"
                >
                  <span className="font-bold text-sky-700">{mfg}:</span>
                  <span className="text-slate-500">{count} un</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="p-5 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Escolha o formato de exportação:
          </span>

          {/* Option 1: Excel Completo */}
          <button
            onClick={() => exportToPurchasingExcel(project, equipments)}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100/80 border-2 border-emerald-500/50 rounded-2xl transition-all group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-emerald-950 block">
                  Planilha Oficial para Compras (.XLSX)
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  Formatada para fornecedores, com aba de resumo e colunas completas.
                </span>
              </div>
            </div>
            <Download className="w-5 h-5 text-emerald-700 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Option 2: CSV para ERP */}
          <button
            onClick={() => exportToPurchasingCsv(project, equipments)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-2xl transition-all group text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Arquivo CSV Separado por Ponto e Vírgula (.CSV)
                </span>
                <span className="text-xs text-slate-500">
                  Ideal para importação direta em sistemas ERP ou bancos de dados.
                </span>
              </div>
            </div>
            <Download className="w-5 h-5 text-slate-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
