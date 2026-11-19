import React, { useState } from 'react';
import {
  Building2,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  FolderOpen,
  Save,
  Info,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Header({
  project,
  setProject,
  onNewEquipment,
  onOpenExport,
  onOpenChecklist,
  equipments,
  onExportJson,
  onImportJson
}) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const approvedCount = equipments.filter(e => e.status === 'approved').length;
  const pendingCount = equipments.filter(e => e.status !== 'approved').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl sticky top-0 z-30">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Project Title */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-slate-950 font-black text-xl tracking-tighter">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800/50">
                  Climapress Engenharia
                </span>
                <span className="text-xs text-slate-400">
                  v2.0 • Seleção & Conferência
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                {project.projectName || 'Nova Seleção de Equipamentos'}
                <button
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="text-xs font-normal text-slate-400 hover:text-sky-300 underline underline-offset-2 ml-1"
                >
                  {isEditingInfo ? 'Fechar Dados' : 'Editar Obra'}
                </button>
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Status Pills */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {approvedCount} Aprovados
              </span>
              <div className="w-px h-4 bg-slate-700" />
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4" />
                {pendingCount} Pendentes
              </span>
            </div>

            {/* Checklist Button */}
            <button
              onClick={onOpenChecklist}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Conferência de normas e regras de segurança"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Conferência</span>
            </button>

            {/* Export To Excel */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/30 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar p/ Compras</span>
            </button>

            {/* Add Equipment */}
            <button
              onClick={onNewEquipment}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Equipamento</span>
            </button>
          </div>
        </div>

        {/* Collapsible Project Metadata Section */}
        {isEditingInfo && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Obra / Empreendimento
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={project.projectName}
                  onChange={(e) => setProject({ ...project, projectName: e.target.value })}
                  placeholder="Nome do Projeto"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={project.clientName}
                onChange={(e) => setProject({ ...project, clientName: e.target.value })}
                placeholder="Razão Social / Cliente"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Local / Cidade
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={project.location}
                  onChange={(e) => setProject({ ...project, location: e.target.value })}
                  placeholder="São Paulo - SP"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Responsável Técnico
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={project.engineerName}
                  onChange={(e) => setProject({ ...project, engineerName: e.target.value })}
                  placeholder="Nome do Engenheiro"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Revisão & Ações
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={project.revision}
                  onChange={(e) => setProject({ ...project, revision: e.target.value })}
                  placeholder="R00"
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white text-center font-bold focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={onExportJson}
                  title="Salvar Projeto em arquivo (.json)"
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </button>
                <label
                  title="Carregar Projeto (.json)"
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
