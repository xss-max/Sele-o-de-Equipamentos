import React from 'react';
import {
  X,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function DataSheetModal({
  isOpen,
  onClose,
  equipment,
  project
}) {
  if (!isOpen || !equipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              Visualização de Folha de Dados
            </span>
            <span className="font-mono text-sm font-bold text-white">
              {equipment.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Standard A4 Technical Document) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-sans print:p-0 text-slate-900">
          
          {/* Document Header */}
          <div className="border-2 border-slate-900 rounded-xl overflow-hidden mb-6">
            <div className="grid grid-cols-4 divide-x-2 divide-slate-900 bg-slate-50 border-b-2 border-slate-900">
              <div className="p-4 col-span-1 flex flex-col justify-center items-center text-center">
                <span className="font-black text-2xl tracking-tighter text-slate-950">
                  CLIMAPRESS
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                  Engenharia Térmica
                </span>
              </div>
              <div className="p-4 col-span-2 flex flex-col justify-center items-center text-center">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-950">
                  FOLHA DE DADOS TÉCNICA
                </h2>
                <span className="text-xs font-bold text-slate-700 uppercase">
                  {equipment.typeName}
                </span>
              </div>
              <div className="p-3 col-span-1 flex flex-col justify-center text-xs space-y-1">
                <div><strong>TAG:</strong> <span className="font-mono font-bold text-sky-800">{equipment.tag}</span></div>
                <div><strong>REV:</strong> {project.revision || 'R00'}</div>
                <div><strong>DATA:</strong> {project.date || new Date().toLocaleDateString('pt-BR')}</div>
              </div>
            </div>

            {/* Project Details Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-300 text-xs bg-white">
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Obra / Projeto</span>
                <span className="font-semibold text-slate-900">{project.projectName}</span>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Cliente</span>
                <span className="font-semibold text-slate-900">{project.clientName}</span>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Local</span>
                <span className="font-semibold text-slate-900">{project.location}</span>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Engenheiro Resp.</span>
                <span className="font-semibold text-slate-900">{project.engineerName}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Características Aerodinâmicas & Operacionais */}
          <div className="mb-5">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 rounded-t-lg">
              1. Características Aerodinâmicas & Operacionais
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Aplicação / Finalidade:</td>
                  <td className="p-2 w-1/4 font-semibold">{equipment.application}</td>
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Fabricante de Referência:</td>
                  <td className="p-2 w-1/4 font-semibold text-sky-900 font-bold">{equipment.manufacturer}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Vazão de Ar de Projeto:</td>
                  <td className="p-2 font-mono font-bold text-slate-900">
                    {Number(equipment.flowRateM3h).toLocaleString('pt-BR')} m³/h ({Number(equipment.flowRateCfm).toLocaleString('pt-BR')} CFM)
                  </td>
                  <td className="p-2 font-bold bg-slate-50">Modelo de Referência:</td>
                  <td className="p-2 font-mono font-semibold">{equipment.model || 'Sob consulta'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Pressão Estática Efetiva:</td>
                  <td className="p-2 font-mono font-bold text-slate-900">
                    {equipment.staticPressureMmca} mmca ({equipment.staticPressurePa} Pa)
                  </td>
                  <td className="p-2 font-bold bg-slate-50">Tipo de Rotor:</td>
                  <td className="p-2 font-semibold">{equipment.rotorType}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50">Nível de Ruído Estimado:</td>
                  <td className="p-2 font-mono font-semibold">{equipment.noiseDbA} dB(A) a 1,5m</td>
                  <td className="p-2 font-bold bg-slate-50">Rotação Operacional:</td>
                  <td className="p-2 font-mono font-semibold">{equipment.rpm} RPM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Motorização & Características Elétricas */}
          <div className="mb-5">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 rounded-t-lg">
              2. Motorização & Instalação Elétrica
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Potência Nominal do Motor:</td>
                  <td className="p-2 w-1/4 font-mono font-bold text-slate-900">
                    {equipment.motorPowerCv} CV ({equipment.motorPowerKw} kW)
                  </td>
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Tensão de Alimentação:</td>
                  <td className="p-2 w-1/4 font-semibold">{equipment.voltage}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Tipo de Partida Prevista:</td>
                  <td className="p-2 font-semibold">{equipment.starterType}</td>
                  <td className="p-2 font-bold bg-slate-50">Grau de Proteção Mecânica:</td>
                  <td className="p-2 font-semibold">{equipment.motorProtection}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50">Motor à Prova de Explosão:</td>
                  <td className="p-2 font-semibold">
                    {equipment.isExplosionProof ? 'SIM (Certificação Ex-d)' : 'NÃO (Motor Blindado Standard)'}
                  </td>
                  <td className="p-2 font-bold bg-slate-50">Frequência da Rede:</td>
                  <td className="p-2 font-semibold">60 Hz</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Detalhes Mecânicos, Filtragem & Segurança */}
          <div className="mb-5">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 rounded-t-lg">
              3. Construção Mecânica, Filtragem & Acessórios
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Tipo de Acoplamento:</td>
                  <td className="p-2 w-1/4 font-semibold">{equipment.coupling}</td>
                  <td className="p-2 font-bold bg-slate-50 w-1/4">Posição de Descarga:</td>
                  <td className="p-2 w-1/4 font-semibold">{equipment.dischargePosition}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Estágio de Filtros:</td>
                  <td className="p-2 font-semibold text-teal-800 font-bold">{equipment.filterType}</td>
                  <td className="p-2 font-bold bg-slate-50">Espessura / Saque Filtro:</td>
                  <td className="p-2 font-semibold">
                    {equipment.filterThicknessMm ? `${equipment.filterThicknessMm} mm` : 'N/A'} • {equipment.filterSaqueSide || 'N/A'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50">Protetor de Polias / NR-12:</td>
                  <td className="p-2 font-semibold">{equipment.hasBeltGuard ? 'SIM (Incluso)' : 'N/A (Direto)'}</td>
                  <td className="p-2 font-bold bg-slate-50">Damper de Sobrepressão:</td>
                  <td className="p-2 font-semibold">{equipment.hasDamper ? 'SIM (Descarga)' : 'NÃO'}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50">Rotor Anti-Faísca:</td>
                  <td className="p-2 font-semibold">{equipment.isAntiSpark ? 'SIM' : 'NÃO'}</td>
                  <td className="p-2 font-bold bg-slate-50">Pintura e Acabamento:</td>
                  <td className="p-2 font-semibold">{equipment.paintType || 'Padrão do Fabricante'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Notas de Fornecimento */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1.5 rounded-t-lg">
              4. Observações Técnicas & Requisitos para Compra
            </h3>
            <div className="border border-slate-300 p-3 rounded-b-lg text-xs text-slate-800 bg-slate-50/50 min-h-[60px] leading-relaxed">
              {equipment.comments || 'Equipamento a ser fornecido completo com contraflanges lisas, amortecedores de vibração compatíveis e placa de identificação em aço inox.'}
            </div>
          </div>

          {/* Signatures & Approvals */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Elaborado por</span>
              <span className="text-slate-600">{project.engineerName || 'Engenharia Climapress'}</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Conferência Técnica</span>
              <span className="text-slate-600">Coordenação de Projetos</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Departamento de Compras</span>
              <span className="text-slate-600">Aprovado para Cotação</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
