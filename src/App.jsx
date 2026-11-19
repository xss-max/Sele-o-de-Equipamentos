import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EquipmentCard from './components/EquipmentCard';
import EquipmentModal from './components/EquipmentModal';
import DataSheetModal from './components/DataSheetModal';
import ChecklistDrawer from './components/ChecklistDrawer';
import ExportSummaryModal from './components/ExportSummaryModal';

import { INITIAL_PROJECT, INITIAL_EQUIPMENTS } from './data/sampleEquipments';
import { EQUIPMENT_TYPES } from './data/equipmentTypes';
import { MANUFACTURERS } from './data/manufacturers';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Layers,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY_PROJECT = 'climapress_equipment_project_v1';
const STORAGE_KEY_EQUIPMENTS = 'climapress_equipment_items_v1';

export default function App() {
  // Estado do Projeto
  const [project, setProject] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECT);
      return saved ? JSON.parse(saved) : INITIAL_PROJECT;
    } catch {
      return INITIAL_PROJECT;
    }
  });

  // Estado dos Equipamentos
  const [equipments, setEquipments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EQUIPMENTS);
      return saved ? JSON.parse(saved) : INITIAL_EQUIPMENTS;
    } catch {
      return INITIAL_EQUIPMENTS;
    }
  });

  // Modais e Painéis
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedForDataSheet, setSelectedForDataSheet] = useState(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filtros e Pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterManufacturer, setFilterManufacturer] = useState('all');

  // Persistência automática
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(project));
    } catch (err) {
      console.error('Erro ao salvar projeto:', err);
    }
  }, [project]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EQUIPMENTS, JSON.stringify(equipments));
    } catch (err) {
      console.error('Erro ao salvar equipamentos:', err);
    }
  }, [equipments]);

  // Ações de CRUD
  const handleCreateOrUpdate = (formData) => {
    if (editingEquipment) {
      setEquipments(equipments.map(eq => eq.id === editingEquipment.id ? { ...formData, id: eq.id } : eq));
    } else {
      const newEquipment = {
        ...formData,
        id: `eq-${Date.now()}`
      };
      setEquipments([newEquipment, ...equipments]);
    }
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  const handleDuplicate = (equipment) => {
    const duplicated = {
      ...equipment,
      id: `eq-${Date.now()}`,
      tag: `${equipment.tag}-COPIA`,
      status: 'pending_review'
    };
    setEquipments([duplicated, ...equipments]);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja remover este equipamento da seleção?')) {
      setEquipments(equipments.filter(e => e.id !== id));
    }
  };

  const handleApproveAll = () => {
    setEquipments(equipments.map(e => ({ ...e, status: 'approved' })));
  };

  // Exportar e Importar JSON para colaboração
  const handleExportJson = () => {
    const data = {
      project,
      equipments,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Selecao_${(project.projectName || 'Projeto').replace(/\s+/g, '_')}_${project.revision || 'R00'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.project && parsed.equipments) {
          setProject(parsed.project);
          setEquipments(parsed.equipments);
          alert('Projeto carregado com sucesso!');
        } else {
          alert('Arquivo JSON inválido para este sistema.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtragem da lista
  const filteredEquipments = equipments.filter(eq => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (eq.tag && eq.tag.toLowerCase().includes(term)) ||
      (eq.typeName && eq.typeName.toLowerCase().includes(term)) ||
      (eq.application && eq.application.toLowerCase().includes(term)) ||
      (eq.manufacturer && eq.manufacturer.toLowerCase().includes(term)) ||
      (eq.model && eq.model.toLowerCase().includes(term));

    const matchesType = filterType === 'all' || eq.typeId === filterType;
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;
    const matchesMfg = filterManufacturer === 'all' || eq.manufacturer === filterManufacturer;

    return matchesSearch && matchesType && matchesStatus && matchesMfg;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Header Principal */}
      <Header
        project={project}
        setProject={setProject}
        onNewEquipment={() => {
          setEditingEquipment(null);
          setIsModalOpen(true);
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        equipments={equipments}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Project Info Strip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Cliente</span>
              <span className="font-extrabold text-slate-800 text-sm">{project.clientName}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Local</span>
              <span className="font-semibold text-slate-800 text-sm">{project.location}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Responsável</span>
              <span className="font-semibold text-slate-800 text-sm">{project.engineerName}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Revisão</span>
              <span className="font-mono font-bold text-sky-700 text-sm">{project.revision}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {filteredEquipments.length} de {equipments.length} equipamento(s)
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por TAG, modelo, fabricante..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filter Type */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todos os Tipos de Equipamento</option>
                {EQUIPMENT_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Filter Manufacturer */}
            <div>
              <select
                value={filterManufacturer}
                onChange={(e) => setFilterManufacturer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todos os Fabricantes</option>
                {MANUFACTURERS.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Todos os Status</option>
                <option value="approved">Aprovados para Compras</option>
                <option value="pending_review">Em Conferência</option>
                <option value="draft">Rascunhos</option>
              </select>
            </div>

          </div>
        </div>

        {/* Equipment Cards Grid */}
        {filteredEquipments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEquipments.map(equipment => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                onEdit={(eq) => {
                  setEditingEquipment(eq);
                  setIsModalOpen(true);
                }}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onViewDataSheet={(eq) => setSelectedForDataSheet(eq)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Wind className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhum equipamento encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Tente alterar os filtros de busca ou cadastre um novo equipamento para esta obra.
            </p>
            <button
              onClick={() => {
                setEditingEquipment(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Adicionar Equipamento
            </button>
          </div>
        )}

      </main>

      {/* Modal de Criação / Edição */}
      <EquipmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleCreateOrUpdate}
        equipmentToEdit={editingEquipment}
        allEquipments={equipments}
      />

      {/* Modal de Folha de Dados A4 */}
      <DataSheetModal
        isOpen={!!selectedForDataSheet}
        onClose={() => setSelectedForDataSheet(null)}
        equipment={selectedForDataSheet}
        project={project}
      />

      {/* Drawer de Conferência & Checklist */}
      <ChecklistDrawer
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        equipments={equipments}
        onApproveAll={handleApproveAll}
        onSelectEquipment={(eq) => {
          setEditingEquipment(eq);
          setIsModalOpen(true);
        }}
      />

      {/* Modal de Exportação para o Departamento de Compras */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        equipments={equipments}
      />

    </div>
  );
}
