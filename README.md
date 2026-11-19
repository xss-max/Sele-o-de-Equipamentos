# Climapress - Seleção de Equipamentos & Conferência de Folha de Dados

Aplicativo desenvolvido sob medida para a equipe de Engenharia da **Climapress**, com foco em padronização técnica, segurança de processo e agilidade no encaminhamento de requisições ao departamento de suprimentos/compras.

---

## 🚀 Como Iniciar o App

Para iniciar o servidor de desenvolvimento e abrir o aplicativo no seu navegador:

```bash
npm run dev
```

Ou para gerar uma nova versão compilada para produção:

```bash
npm run build
```

---

## 🛠️ Principais Recursos e Módulos

### 1. Cadastro e Seleção de Equipamentos
* **Tipos suportados:** Caixas de Ventilação / Ar Externo (`VAE`), Ventiladores Centrífugos (`VE`), Exaustores de Sanitários e Cozinhas (`EX`), Ventiladores de Pressurização de Escada (`VPE`) e Axiais Industriais (`VA`).
* **Cálculo e Conversão Instantânea:**
  * Vazão em $\text{m}^3/\text{h} \longleftrightarrow \text{CFM}$.
  * Pressão estática em $\text{mmca} \longleftrightarrow \text{Pa}$.
  * Estimativa de potência requerida no eixo com rendimento e sugestão do motor comercial com margem de segurança normatizada ($15\%\text{ a }20\%$).
* **Fabricantes de Referência Integrados:** Projelmec, Soler & Palau (S&P), BerlinerLuft, Otam, Trox, Casals e opção para fabricantes personalizados.

### 2. Motor de Conferência de Folha de Dados (Segurança de Processo)
* **Auditoria de Potência:** Alerta caso o motor selecionado esteja abaixo ou muito próximo da potência no eixo (risco de sobrecarga térmica).
* **Partida Elétrica:** Alerta se motores a partir de $5\text{ CV}$ estiverem configurados em partida direta na rede.
* **Norma Regulamentadora NR-12:** Exigência automática de protetor de transmissão para acoplamento por polias e correias.
* **Segurança contra Incêndio:** Verificação de dampers de sobrepressão/contrafluxo para sistemas de pressurização de escadas.
* **Acessibilidade para Manutenção:** Checagem do lado de saque dos filtros (Direito, Esquerdo, Superior ou Inferior) para Caixas de Ventilação.

### 3. Visualização e Impressão de Folha de Dados Técnica (A4 / PDF)
* Visualização com layout padronizado da Climapress (dados da obra, cliente, engenheiro responsável, características aerodinâmicas, elétricas, mecânicas, opcionais e campos para assinaturas de aprovação).
* Botão direto para **Imprimir / Salvar em PDF** formatado para papel A4.

### 4. Exportação para o Departamento de Compras
* **Exportação Oficial em Excel (.XLSX):**
  * Aba 1: Tabela detalhada de compras com todas as especificações e observações técnicas para cotação.
  * Aba 2: Resumo quantitativo agrupado por fabricante de referência para cotações parciais.
* **Exportação em CSV:** Para integração com ERP e sistemas corporativos.
* **Backup de Projeto (.JSON):** Salve o projeto completo em arquivo e compartilhe com outros colaboradores.
