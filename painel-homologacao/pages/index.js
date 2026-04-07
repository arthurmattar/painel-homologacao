import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";

// ── DADOS ESTÁTICOS (atualizado automaticamente) ──────────────────────────────

const JIRA_STATIC_DATA = {"issues":[{"key":"AS-177","summary":"PB Ambiental - receptor","status":"Backlog","created":"2026-04-07","estado":[],"servico":[]},{"key":"AS-176","summary":"Grupo Indcom","status":"Aguardando documentação","created":"2026-04-06","estado":[],"servico":[]},{"key":"AS-175","summary":"Lux Tree","status":"Aguardando documentação","created":"2026-04-06","estado":["DF"],"servico":[]},{"key":"AS-174","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2026-04-06","estado":[],"servico":[]},{"key":"AS-173","summary":"Sim engenharia Ambiental","status":"Backlog","created":"2026-04-01","estado":["PB"],"servico":["Receptor","Transportador"]},{"key":"AS-172","summary":"Esgomil","status":"Backlog","created":"2026-04-01","estado":["SC"],"servico":[]},{"key":"AS-171","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2026-04-01","estado":[],"servico":[]},{"key":"AS-170","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2026-04-01","estado":[],"servico":[]},{"key":"AS-169","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2026-04-01","estado":[],"servico":[]},{"key":"AS-168","summary":"Eco parque - Grupo CORPUS","status":"Elaboração de Contrato","created":"2026-03-31","estado":[],"servico":[]},{"key":"AS-167","summary":"Ecomark - Grupo CORPUS","status":"Elaboração de Contrato","created":"2026-03-31","estado":[],"servico":[]},{"key":"AS-166","summary":"JF Caçambas","status":"Backlog","created":"2026-03-30","estado":["SP"],"servico":["Transportador"]},{"key":"AS-165","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2026-03-27","estado":[],"servico":[]},{"key":"AS-164","summary":"Renove Soluções","status":"Homologado","created":"2026-03-26","estado":["RJ"],"servico":[]},{"key":"AS-163","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-25","estado":[],"servico":[]},{"key":"AS-162","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-24","estado":[],"servico":[]},{"key":"AS-161","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-23","estado":[],"servico":[]},{"key":"AS-160","summary":"Corpus - Indaiatuba","status":"Elaboração de Contrato","created":"2026-03-20","estado":["SP"],"servico":["Transportador"]},{"key":"AS-159","summary":"Nova Ambiental","status":"Aguardando documentação","created":"2026-03-20","estado":["SP"],"servico":[]},{"key":"AS-158","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-20","estado":[],"servico":[]},{"key":"AS-157","summary":"3A Soluções Ambientais (Renotran Ambiental)","status":"Elaboração de Contrato","created":"2026-03-18","estado":["SP"],"servico":[]},{"key":"AS-156","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-18","estado":[],"servico":[]},{"key":"AS-155","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-17","estado":[],"servico":[]},{"key":"AS-154","summary":"Vigor Sucatas","status":"Backlog","created":"2026-03-16","estado":["PR"],"servico":[]},{"key":"AS-153","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-16","estado":[],"servico":[]},{"key":"AS-152","summary":"Cristais Solucoes Ambientais e Gestao de Residuos LTDA","status":"Documentação Irregular","created":"2026-03-13","estado":["MA"],"servico":["Receptor","Transportador"]},{"key":"AS-151","summary":"Filial Brusque - Ambserv Tratamento de Residuos Ltda - Veolia SC","status":"Backlog","created":"2026-03-13","estado":["SC"],"servico":[]},{"key":"AS-150","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-12","estado":[],"servico":[]},{"key":"AS-149","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-12","estado":[],"servico":[]},{"key":"AS-148","summary":"Cadastro Operador WMS","status":"Cadastro WMS","created":"2026-03-11","estado":[],"servico":[]},{"key":"AS-147","summary":"Jvs Ferro Velho - Londrina","status":"Backlog","created":"2026-03-10","estado":["PR"],"servico":[]},{"key":"AS-146","summary":"Aliança Metais","status":"Backlog","created":"2026-03-10","estado":["PR"],"servico":["Receptor"]},{"key":"AS-145","summary":"Crivellaro","status":"Backlog","created":"2026-03-09","estado":["SP"],"servico":[]},{"key":"AS-144","summary":"GVPar - RSU - classe II","status":"Elaboração de Contrato","created":"2026-03-06","estado":["DF"],"servico":[]},{"key":"AS-143","summary":"Sustentar ","status":"Documentação Irregular","created":"2026-03-06","estado":["GO"],"servico":["Receptor","Transportador"]},{"key":"AS-142","summary":"Lara Alegre","status":"Homologado","created":"2026-03-03","estado":[],"servico":[]},{"key":"AS-141","summary":"Hidrofossas - DF","status":"Backlog","created":"2026-03-02","estado":["DF"],"servico":["Transportador"]},{"key":"AS-140","summary":"DF - Limpa Fossa","status":"Backlog","created":"2026-03-02","estado":["DF"],"servico":["Transportador"]},{"key":"AS-139","summary":"Reversa Log","status":"Homologado","created":"2026-02-27","estado":["SP"],"servico":["Receptor"]},{"key":"AS-138","summary":"Massalas","status":"Deletar - duplicado","created":"2026-02-26","estado":["MG"],"servico":["Receptor","Transportador"]},{"key":"AS-137","summary":"Metalcap","status":"Elaboração de Contrato","created":"2026-02-26","estado":["DF"],"servico":["Receptor","Transportador"]},{"key":"AS-136","summary":"RCD Reciclaveis","status":"Documentação Irregular","created":"2026-02-26","estado":["MG"],"servico":["Receptor","Transportador"]},{"key":"AS-135","summary":"Transbordo Multilixo Jaguaré","status":"Elaboração de Contrato","created":"2026-02-25","estado":["SP"],"servico":["Receptor"]},{"key":"AS-134","summary":"Di On Ambiental","status":"Elaboração de Contrato","created":"2026-02-23","estado":["SP"],"servico":["Receptor","Transportador"]},{"key":"AS-133","summary":"3R AMBIENTAL - DF","status":"Elaboração de Contrato","created":"2026-02-20","estado":["DF"],"servico":["Receptor"]},{"key":"AS-132","summary":"GIGLIO","status":"Elaboração de Contrato","created":"2026-02-18","estado":["SP"],"servico":["Receptor","Transportador"]},{"key":"AS-131","summary":"Ecocity","status":"Elaboração de Contrato","created":"2026-02-13","estado":["SP"],"servico":["Transportador"]},{"key":"AS-130","summary":"Ambientuus - Santa Catarina","status":"Elaboração de Contrato","created":"2026-02-12","estado":["RS"],"servico":[]},{"key":"AS-129","summary":"DUPLICADO - GVPAR ","status":"Backlog","created":"2026-02-10","estado":["GO"],"servico":["Transportador"]},{"key":"AS-128","summary":"Goyazes Ambiental","status":"Elaboração de Contrato","created":"2026-02-10","estado":["GO"],"servico":["Transportador"]},{"key":"AS-127","summary":"CTR - Soluções Ambientais - Grupo ARX","status":"Elaboração de Contrato","created":"2026-02-09","estado":["SP"],"servico":[]},{"key":"AS-126","summary":"Express Serviços de Coleta e Transporte de Resíduos do Serviço de Saúde Ltda (Express Coletas)","status":"Backlog","created":"2026-02-09","estado":["SC"],"servico":["Receptor","Transportador"]},{"key":"AS-125","summary":"Reverse – Gerenciamento de Resíduos Tecnológicos Ltda","status":"Elaboração de Contrato","created":"2026-02-09","estado":["RS"],"servico":[]},{"key":"AS-124","summary":"CTR PE - CENTRAL DE TRATAMENTO DE RESÍDUOS","status":"Backlog","created":"2026-02-02","estado":[],"servico":[]},{"key":"AS-123","summary":"Multilix","status":"Elaboração de Contrato","created":"2026-02-02","estado":[],"servico":[]},{"key":"AS-122","summary":"Petroecol","status":"Homologado","created":"2026-01-28","estado":["SP"],"servico":[]},{"key":"AS-121","summary":"Saneaz - Araçatuba","status":"Elaboração de Contrato","created":"2026-01-27","estado":["SP"],"servico":[]},{"key":"AS-120","summary":"Cetric","status":"Backlog","created":"2026-01-21","estado":[],"servico":[]},{"key":"AS-119","summary":"Eccoplastic","status":"Elaboração de Contrato","created":"2026-01-21","estado":[],"servico":[]},{"key":"AS-118","summary":"4R Ambiental","status":"Elaboração de Contrato","created":"2026-01-21","estado":[],"servico":[]},{"key":"AS-117","summary":"Destral","status":"Backlog","created":"2026-01-19","estado":["PR"],"servico":["Transportador"]},{"key":"AS-116","summary":"Cetric","status":"Elaboração de Contrato","created":"2026-01-15","estado":["MG"],"servico":["Receptor","Transportador"]},{"key":"AS-115","summary":"RG Ambiental","status":"Elaboração de Contrato","created":"2026-01-12","estado":["SP"],"servico":[]},{"key":"AS-114","summary":"RG Ambiental","status":"Deletar - duplicado","created":"2026-01-12","estado":[],"servico":[]},{"key":"AS-113","summary":"BIOMA BRASIL","status":"Elaboração de Contrato","created":"2026-01-06","estado":[],"servico":["Receptor","Transportador"]},{"key":"AS-112","summary":"ECOBLENDING AMBIENTAL LTDA","status":"Elaboração de Contrato","created":"2026-01-06","estado":[],"servico":["Receptor","Transportador"]},{"key":"AS-111","summary":"Momento Engenharia ( Veolia)","status":"Homologado","created":"2026-01-06","estado":[],"servico":["Receptor","Transportador"]},{"key":"AS-110","summary":"TRANSOBRAS TRANSPORTE LOCAÇÃO E RECICLAVEIS LTDA","status":"Elaboração de Contrato","created":"2026-01-06","estado":[],"servico":["Receptor","Transportador"]},{"key":"AS-109","summary":"Ambiental Residuos","status":"Backlog","created":"2025-12-26","estado":["DF"],"servico":["Transportador"]},{"key":"AS-108","summary":"Paletec","status":"Rejeitado","created":"2025-12-23","estado":[],"servico":[]},{"key":"AS-107","summary":"Target","status":"Elaboração de Contrato","created":"2025-12-19","estado":[],"servico":[]},{"key":"AS-106","summary":"CVR OESTE","status":"Homologado","created":"2025-12-18","estado":[],"servico":[]},{"key":"AS-105","summary":"Rio Branco Coprocessamento","status":"Elaboração de Contrato","created":"2025-12-16","estado":["PR"],"servico":["Receptor"]},{"key":"AS-104","summary":"Compostamais","status":"Elaboração de Contrato","created":"2025-12-16","estado":["PR"],"servico":["Receptor"]},{"key":"AS-103","summary":"Samuel","status":"Elaboração de Contrato","created":"2025-12-15","estado":[],"servico":[]},{"key":"AS-102","summary":"Higienelar","status":"Rejeitado","created":"2025-12-15","estado":[],"servico":[]},{"key":"AS-101","summary":"Martins Locações","status":"Elaboração de Contrato","created":"2025-12-12","estado":[],"servico":[]},{"key":"AS-100","summary":"Cetric -SC","status":"Elaboração de Contrato","created":"2025-12-11","estado":["SC"],"servico":["Receptor","Transportador"]},{"key":"AS-99","summary":"Coleta Soluções Ambientais","status":"Elaboração de Contrato","created":"2025-12-11","estado":[],"servico":["Transportador"]},{"key":"AS-98","summary":"FENIX gerenciamento de resíduos ltda","status":"Elaboração de Contrato","created":"2025-12-10","estado":[],"servico":[]},{"key":"AS-97","summary":"Amazon Clean","status":"Backlog","created":"2025-12-09","estado":["AM"],"servico":["Receptor","Transportador"]},{"key":"AS-96","summary":"Massalas Compostagem","status":"Elaboração de Contrato","created":"2025-12-09","estado":["MG"],"servico":["Receptor","Transportador"]},{"key":"AS-95","summary":"DMS Ambiental","status":"Elaboração de Contrato","created":"2025-12-09","estado":[],"servico":[]},{"key":"AS-94","summary":"Eco Mix Sustentável","status":"Elaboração de Contrato","created":"2025-12-09","estado":[],"servico":[]},{"key":"AS-93","summary":"CETRIC Cia Norte","status":"Rejeitado","created":"2025-12-09","estado":[],"servico":[]},{"key":"AS-92","summary":"Guarulhos Sucatas","status":"Elaboração de Contrato","created":"2025-12-08","estado":[],"servico":[]},{"key":"AS-91","summary":"Meioeste","status":"Elaboração de Contrato","created":"2025-12-05","estado":["RS"],"servico":["Receptor"]},{"key":"AS-90","summary":"Ambiental Sul SC","status":"Elaboração de Contrato","created":"2025-12-04","estado":["SC"],"servico":["Transportador"]},{"key":"AS-89","summary":"Centro Sul- PR","status":"Elaboração de Contrato","created":"2025-12-04","estado":[],"servico":[]},{"key":"AS-88","summary":"CTRVV","status":"Homologado","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-87","summary":"Coletrash","status":"Homologado","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-86","summary":"Eccos Ambiental - RR","status":"Elaboração de Contrato","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-85","summary":"Ares do Paraná - PR","status":"Elaboração de Contrato","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-84","summary":"Utep - SP","status":"Elaboração de Contrato","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-83","summary":"Casca Coletas de Resíduos - RJ","status":"Elaboração de Contrato","created":"2025-12-02","estado":[],"servico":[]},{"key":"AS-82","summary":"Miglix","status":"Elaboração de Contrato","created":"2025-11-18","estado":[],"servico":["Receptor","Transportador"]},{"key":"AS-81","summary":"Cheta Metais","status":"Elaboração de Contrato","created":"2025-11-18","estado":["MG"],"servico":["Transportador"]},{"key":"AS-80","summary":"Inovar Ambiental","status":"Elaboração de Contrato","created":"2025-11-18","estado":[],"servico":[]},{"key":"AS-79","summary":"Pass Ambiental","status":"Elaboração de Contrato","created":"2025-11-17","estado":[],"servico":[]},{"key":"AS-78","summary":"Corpus","status":"Elaboração de Contrato","created":"2025-11-17","estado":[],"servico":[]},{"key":"AS-77","summary":"Retec","status":"Elaboração de Contrato","created":"2025-11-12","estado":[],"servico":[]},{"key":"AS-76","summary":"Disque Óleo","status":"Elaboração de Contrato","created":"2025-11-12","estado":[],"servico":[]},{"key":"AS-75","summary":"Ambiente Limpo","status":"Elaboração de Contrato","created":"2025-11-07","estado":[],"servico":[]},{"key":"AS-74","summary":"Coletora Barbosa","status":"Elaboração de Contrato","created":"2025-11-07","estado":[],"servico":[]},{"key":"AS-73","summary":"E Ambiental","status":"Elaboração de Contrato","created":"2025-11-07","estado":[],"servico":[]},{"key":"AS-72","summary":"Reversa Log","status":"Elaboração de Contrato","created":"2025-11-07","estado":[],"servico":[]},{"key":"AS-71","summary":"Indama - Para","status":"Elaboração de Contrato","created":"2025-11-06","estado":[],"servico":[]},{"key":"AS-70","summary":"Indama - Ceara","status":"Elaboração de Contrato","created":"2025-11-06","estado":[],"servico":[]},{"key":"AS-69","summary":"Indama - Alagoas","status":"Documentação Irregular","created":"2025-11-06","estado":["AL"],"servico":["Transportador"]},{"key":"AS-68","summary":"CR Remoção","status":"Elaboração de Contrato","created":"2025-11-06","estado":[],"servico":[]},{"key":"AS-67","summary":"Eco Ambiental","status":"Elaboração de Contrato","created":"2025-11-05","estado":[],"servico":[]},{"key":"AS-66","summary":"CCI Ambiental","status":"Deletar - duplicado","created":"2025-10-31","estado":[],"servico":[]},{"key":"AS-65","summary":"Eco+ Ambiental","status":"Elaboração de Contrato","created":"2025-10-30","estado":[],"servico":[]},{"key":"AS-64","summary":"Tombstone","status":"Rejeitado","created":"2025-10-29","estado":[],"servico":[]},{"key":"AS-63","summary":"Rafa Entulhos Ltda","status":"Rejeitado","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-62","summary":"C.B.F.T Cia Brasileira de Florestas Tropicais","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-61","summary":"MULTILIX / AGILIX","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-60","summary":"Ecosense Ambiental","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-59","summary":"Pró Ambiental","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-58","summary":"Iemma Gerenciadora","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-57","summary":"TWM","status":"Elaboração de Contrato","created":"2025-10-27","estado":[],"servico":[]},{"key":"AS-56","summary":"Tamborline","status":"Elaboração de Contrato","created":"2025-10-16","estado":[],"servico":[]},{"key":"AS-55","summary":"Bioclean (Grupo Urban)","status":"Elaboração de Contrato","created":"2025-10-16","estado":[],"servico":[]},{"key":"AS-54","summary":"Kioto (Grupo Urban) ","status":"Elaboração de Contrato","created":"2025-10-16","estado":[],"servico":[]},{"key":"AS-53","summary":"Cril Ambiental","status":"Elaboração de Contrato","created":"2025-09-05","estado":[],"servico":[]},{"key":"AS-52","summary":"Cidade Limpa","status":"Rejeitado","created":"2025-09-05","estado":[],"servico":[]},{"key":"AS-51","summary":"OCA AMBIENTAL","status":"Elaboração de Contrato","created":"2025-09-02","estado":[],"servico":[]},{"key":"AS-50","summary":"Solução Ambiental","status":"Elaboração de Contrato","created":"2025-09-01","estado":[],"servico":[]},{"key":"AS-49","summary":"RETIÓLEO","status":"Elaboração de Contrato","created":"2025-08-28","estado":[],"servico":[]},{"key":"AS-48","summary":"Taborda","status":"Elaboração de Contrato","created":"2025-08-21","estado":[],"servico":[]},{"key":"AS-47","summary":"ECOPETRO SOLUCOES AMBIENTAIS LTDA","status":"Elaboração de Contrato","created":"2025-08-19","estado":[],"servico":[]},{"key":"AS-46","summary":"Ambipar","status":"Rejeitado","created":"2025-08-19","estado":[],"servico":[]},{"key":"AS-45","summary":"Mix Soluções BA","status":"Elaboração de Contrato","created":"2025-08-19","estado":[],"servico":[]},{"key":"AS-44","summary":"VANLIX","status":"Elaboração de Contrato","created":"2025-08-08","estado":[],"servico":[]},{"key":"AS-43","summary":"Garantir dados de Receptor na base","status":"Tarefas pendentes","created":"2025-08-05","estado":[],"servico":[]},{"key":"AS-42","summary":"Garantir dados de Operador na base","status":"Tarefas pendentes","created":"2025-08-05","estado":[],"servico":[]},{"key":"AS-41","summary":"Cadastro Receptor WMS","status":"Tarefas pendentes","created":"2025-08-05","estado":[],"servico":[]},{"key":"AS-40","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2025-08-05","estado":[],"servico":[]},{"key":"AS-39","summary":"AMBILIXO","status":"Elaboração de Contrato","created":"2025-07-31","estado":[],"servico":[]},{"key":"AS-38","summary":"Grupo Cunha Paraíso Ambiental - RJ","status":"Elaboração de Contrato","created":"2025-07-28","estado":[],"servico":[]},{"key":"AS-37","summary":"RECICLADOS LIMEIRA","status":"Backlog","created":"2025-07-24","estado":[],"servico":[]},{"key":"AS-36","summary":"PLASTPEL","status":"Backlog","created":"2025-07-24","estado":[],"servico":[]},{"key":"AS-35","summary":"Transp Sanja","status":"Backlog","created":"2025-07-22","estado":[],"servico":[]},{"key":"AS-34","summary":"GRT Óleo Vegetal - PR","status":"Backlog","created":"2025-07-22","estado":["PR"],"servico":["Receptor","Transportador"]},{"key":"AS-33","summary":"Ambiente Limpo Serviços de Limpeza Urbana - RN","status":"Deletar - duplicado","created":"2025-07-22","estado":[],"servico":[]},{"key":"AS-32","summary":"Brados Ambiental - Abrangência Nacional","status":"Backlog","created":"2025-07-22","estado":["SP"],"servico":["Receptor","Transportador"]},{"key":"AS-31","summary":"Recol Ambiental - GO e MT","status":"Backlog","created":"2025-07-22","estado":["MT"],"servico":["Transportador"]},{"key":"AS-30","summary":"Supera Soluções Ambientais - MT","status":"Elaboração de Contrato","created":"2025-07-22","estado":[],"servico":[]},{"key":"AS-29","summary":"RPMA transporte e serviço","status":"Backlog","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-28","summary":"Retioleo","status":"Rejeitado","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-27","summary":"Biomarca Reciclagem Ltda - ES","status":"Backlog","created":"2025-07-18","estado":["ES"],"servico":["Receptor","Transportador"]},{"key":"AS-26","summary":"Anderson - Autônomo","status":"Rejeitado","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-25","summary":"HBR AVIAÇÃO SA","status":"Rejeitado","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-24","summary":"Sara","status":"Deletar - duplicado","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-23","summary":"Galeguinho Transportes","status":"Backlog","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-22","summary":"WL Transporte","status":"Backlog","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-21","summary":"Análise Cartão CNPJ","status":"Tarefas pendentes","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-20","summary":"Análise CTF","status":"Tarefas pendentes","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-19","summary":"Análise AVCB","status":"Tarefas pendentes","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-18","summary":"Análise LO","status":"Tarefas pendentes","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-17","summary":"Valoriza Ambiental","status":"Elaboração de Contrato","created":"2025-07-18","estado":[],"servico":[]},{"key":"AS-16","summary":"Ultrassol","status":"Elaboração de Contrato","created":"2025-07-17","estado":[],"servico":[]},{"key":"AS-14","summary":"Garantir dados de Receptor na base","status":"Tarefas pendentes","created":"2025-07-16","estado":[],"servico":[]},{"key":"AS-13","summary":"Garantir dados de Operador na base","status":"Tarefas pendentes","created":"2025-07-16","estado":[],"servico":[]},{"key":"AS-12","summary":"Cadastro Receptores WMS","status":"Tarefas pendentes","created":"2025-07-16","estado":[],"servico":[]},{"key":"AS-11","summary":"Cadastro Operador WMS","status":"Tarefas pendentes","created":"2025-07-16","estado":[],"servico":[]},{"key":"AS-10","summary":"Ita Ambiental - PR","status":"Elaboração de Contrato","created":"2025-07-15","estado":[],"servico":[]},{"key":"AS-9","summary":"Usina Thermo Magnética - DF","status":"Rejeitado","created":"2025-07-15","estado":[],"servico":[]},{"key":"AS-8","summary":"Disque Óleo - RJ","status":"Rejeitado","created":"2025-07-15","estado":[],"servico":[]},{"key":"AS-7","summary":"MB Engenharia","status":"Deletar - duplicado","created":"2025-07-10","estado":[],"servico":[]},{"key":"AS-6","summary":"Solução Ambiental","status":"Deletar - duplicado","created":"2025-07-10","estado":[],"servico":[]}],"fetchedAt":"2026-04-07T15:29:51.000Z"};

// ── CONSTANTES ────────────────────────────────────────────────────────────────

const FUNIL_ORDER = [
  "Backlog","ENVIO DA DOCUMENTAÇÃO","Aguardando documentação",
  "Documentação Irregular","Elaboração de Contrato",
  "Cadastro nos sistemas internos","Conferir credenciais",
  "Rejeitado","Deletar - duplicado",
];

const ACTIVE_STATUSES = [
  "Aguardando documentação","Elaboração de Contrato",
  "Documentação Irregular","Backlog","ENVIO DA DOCUMENTAÇÃO",
];

const ESTADO_COLORS = {
  SP:"#3b82f6",RS:"#10b981",SC:"#f59e0b",DF:"#ef4444",MG:"#8b5cf6",
  PR:"#06b6d4",GO:"#f97316",MA:"#ec4899",MT:"#84cc16",AM:"#14b8a6",
  AL:"#fb923c",ES:"#a78bfa","Não inf.":"#9ca3af",
};

const SERVICO_COLORS = {
  "Somente Transportador":"#3b82f6",
  "Somente Receptor":"#10b981",
  "Transp. e Receptor":"#f59e0b",
  "Não inf.":"#9ca3af",
};

const STATUS_COLORS = {
  "Backlog":"#6b7280","Aguardando documentação":"#3b82f6",
  "Elaboração de Contrato":"#f59e0b","Documentação Irregular":"#ef4444",
  "Homologado":"#22c55e","Rejeitado":"#94a3b8","Tarefas pendentes":"#fcd34d",
};

const SERVICO_ORDER = ["Somente Transportador","Somente Receptor","Transp. e Receptor","Não inf."];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function getWeek(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

function formatWeek(w) {
  const d = new Date(w + "T12:00:00");
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
}

function getLast6Weeks() {
  const today = new Date();
  const weeks = new Set();
  for (let i = 0; i < 42; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    weeks.add(getWeek(d.toISOString().split("T")[0]));
  }
  return [...weeks].sort().slice(-6);
}

function classifyServico(servicoList) {
  if (!servicoList || servicoList.length === 0) return "Não inf.";
  const hasT = servicoList.includes("Transportador");
  const hasR = servicoList.includes("Receptor");
  if (hasT && hasR) return "Transp. e Receptor";
  if (hasT) return "Somente Transportador";
  if (hasR) return "Somente Receptor";
  return "Não inf.";
}

function normalizeStatus(s) {
  if (s === "Homologado" || s === "ENVIO DA DOCUMENTAÇÃO" || s === "Tarefas pendentes")
    return "Elaboração de Contrato";
  return s;
}

const TotalLabel = ({ x, y, width, value }) => {
  if (!value) return null;
  return (
    <text x={x + width / 2} y={y - 5} fill="#374151"
      textAnchor="middle" fontSize={11} fontWeight={700}>{value}</text>
  );
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setIssues(JIRA_STATIC_DATA.issues || []);
    setFetchedAt(JIRA_STATIC_DATA.fetchedAt);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const weeks = useMemo(() => getLast6Weeks(), []);

  // Cutoff dinâmico: 7 dias atrás
  const cutoffDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const enriched = useMemo(() =>
    issues.map((i) => ({
      ...i,
      statusNorm: normalizeStatus(i.status),
      week: i.created ? getWeek(i.created) : null,
      estadoList: i.estado || [],
      servicoList: i.servico || [],
      servicoKey: classifyServico(i.servico),
    })), [issues]);

  const recent = useMemo(() =>
    enriched.filter((i) => i.week && weeks.includes(i.week)), [enriched, weeks]);

  // Chart 1 — Por Estado
  const allEstados = useMemo(() => {
    const s = new Set();
    recent.forEach((i) => {
      if (i.estadoList.length) i.estadoList.forEach((e) => s.add(e));
      else s.add("Não inf.");
    });
    return [...s].sort((a, b) =>
      a === "Não inf." ? 1 : b === "Não inf." ? -1 : a.localeCompare(b));
  }, [recent]);

  const chart1 = useMemo(() => weeks.map((w) => {
    const row = { week: formatWeek(w) };
    allEstados.forEach((e) => (row[e] = 0));
    recent.filter((i) => i.week === w).forEach((i) => {
      const tags = i.estadoList.length ? i.estadoList : ["Não inf."];
      tags.forEach((e) => { row[e] = (row[e] || 0) + 1; });
    });
    row.total = recent.filter((i) => i.week === w).length;
    return row;
  }), [weeks, recent, allEstados]);

  // Chart 2 — Por Tipo de Serviço
  const allServicos = useMemo(() => {
    const s = new Set();
    recent.forEach((i) => s.add(i.servicoKey));
    return SERVICO_ORDER.filter((k) => s.has(k));
  }, [recent]);

  const chart2 = useMemo(() => weeks.map((w) => {
    const row = { week: formatWeek(w) };
    allServicos.forEach((s) => (row[s] = 0));
    recent.filter((i) => i.week === w).forEach((i) => {
      row[i.servicoKey] = (row[i.servicoKey] || 0) + 1;
    });
    row.total = recent.filter((i) => i.week === w).length;
    return row;
  }), [weeks, recent, allServicos]);

  // Chart 3 — Por Status
  const statusCounts = useMemo(() => {
    const counts = {}, stuckBy = {};
    issues.forEach((i) => {
      counts[i.status] = (counts[i.status] || 0) + 1;
      if (ACTIVE_STATUSES.includes(i.status) && i.created && new Date(i.created + "T00:00:00") <= cutoffDate)
        stuckBy[i.status] = (stuckBy[i.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([s, c]) => ({
        status: s, count: c,
        stuck: stuckBy[s] || 0,
        stuckPct: stuckBy[s] ? Math.round((stuckBy[s] / c) * 100) : 0,
      }))
      .sort((a, b) => {
        const ia = FUNIL_ORDER.indexOf(a.status);
        const ib = FUNIL_ORDER.indexOf(b.status);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
  }, [issues, cutoffDate]);

  const stuckCount = useMemo(() =>
    issues.filter((i) =>
      ACTIVE_STATUSES.includes(i.status) &&
      i.created && new Date(i.created + "T00:00:00") <= cutoffDate
    ).length, [issues, cutoffDate]);

  const tabs = ["📊 Por Estado", "🚚 Por Tipo de Serviço", "📋 Por Status"];

  const kpis = [
    { label: "Total de cards", value: issues.length, color: "#1e3a5f" },
    { label: "Novos (6 semanas)", value: recent.length, color: "#3b82f6" },
    { label: "Parados >7 dias", value: stuckCount, color: "#ef4444" },
  ];

  const updatedLabel = fetchedAt
    ? `Atualizado em ${new Date(fetchedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })}`
    : "Carregando...";

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Inter, sans-serif; background: #f0f4f8; }`}</style>
      <div style={{ minHeight: "100vh", padding: "20px" }}>

        {/* Header */}
        <div style={{ background: "#1e3a5f", borderRadius: "12px", padding: "20px 28px", marginBottom: "20px", color: "#fff" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, marginBottom: "4px" }}>
            Musa Tecnologia · Jira AS
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Dashboard — Homologação de Operadores</h1>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                Últimas 6 semanas · {issues.length} cards totais · {updatedLabel}
              </div>
            </div>
            <button
              onClick={fetchData}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
            >
              ↻ Atualizar
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", color: "#888", fontSize: "14px", marginBottom: "20px" }}>
            Buscando dados do Jira...
          </div>
        )}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "12px", padding: "16px 20px", color: "#c0392b", fontSize: "13px", marginBottom: "20px" }}>
            Erro: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "20px" }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "16px 20px", borderLeft: `4px solid ${k.color}` }}>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{k.label}</div>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {tabs.map((t, i) => (
                <button key={i} onClick={() => setTab(i)} style={{
                  padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 600,
                  background: tab === i ? "#1e3a5f" : "#fff",
                  color: tab === i ? "#fff" : "#555",
                  boxShadow: tab === i ? "0 2px 8px rgba(30,58,95,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
                }}>{t}</button>
              ))}
            </div>

            {/* Conteúdo */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

              {/* Tab 0 — Por Estado */}
              {tab === 0 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Novos cards por semana · por Estado</h2>
                  <p style={{ margin: "0 0 20px", fontSize: "12px", color: "#888" }}>
                    Campo <strong>📍 customfield_12555 — Localização do Operador</strong> · "Não inf." = campo vazio no Jira
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chart1} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {allEstados.map((e, idx) => (
                        <Bar key={e} dataKey={e} stackId="a" fill={ESTADO_COLORS[e] || "#ccc"}>
                          {idx === allEstados.length - 1 && <LabelList dataKey="total" content={TotalLabel} />}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Tab 1 — Por Tipo de Serviço */}
              {tab === 1 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Novos cards por semana · por Tipo de Serviço</h2>
                  <p style={{ margin: "0 0 20px", fontSize: "12px", color: "#888" }}>
                    Campo <strong>🚚 customfield_12557 — Tipo de Serviço</strong> · "Não inf." = campo vazio no Jira
                  </p>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={chart2} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {allServicos.map((s, idx) => (
                        <Bar key={s} dataKey={s} stackId="a" fill={SERVICO_COLORS[s] || "#aaa"}>
                          {idx === allServicos.length - 1 && <LabelList dataKey="total" content={TotalLabel} />}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {/* Tab 2 — Por Status */}
              {tab === 2 && (
                <>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", color: "#1e3a5f" }}>Total de cards por Status</h2>
                  <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#888" }}>
                    Ordenado pela sequência do funil · {issues.length} cards totais
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", background: "#fff5f5", border: "1px solid #ffcdd2", borderRadius: "8px", padding: "10px 16px" }}>
                    <div style={{ width: "32px", height: "4px", background: "#ef4444", borderRadius: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#c0392b", fontWeight: 600 }}>
                      {stuckCount} operadores parados há mais de 7 dias na mesma etapa
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "20px", marginBottom: "12px", paddingLeft: "195px" }}>
                    {[["#94a3b8", "Total de cards"], ["#ef4444", "% parados >7 dias"]].map(([c, l]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: c }} />
                        <span style={{ fontSize: "12px", color: "#555" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 600, width: "190px" }}>Status</th>
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 600, width: "220px" }}>Total de cards</th>
                          <th style={{ width: "20px" }} />
                          <th style={{ textAlign: "left", padding: "8px 12px", color: "#ef4444", fontWeight: 600, width: "220px" }}>% parados &gt;7 dias</th>
                          <th style={{ width: "20px" }} />
                        </tr>
                      </thead>
                      <tbody>
                        {statusCounts.map((s, i) => {
                          const maxCount = Math.max(...statusCounts.map((x) => x.count));
                          const barW = Math.round((s.count / maxCount) * 180);
                          const pctBarW = Math.round((s.stuckPct / 100) * 180);
                          const isActive = ACTIVE_STATUSES.includes(s.status);
                          return (
                            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                              <td style={{ padding: "9px 12px", color: "#374151", fontWeight: 500 }}>
                                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", background: STATUS_COLORS[s.status] || "#bbb", marginRight: "7px", verticalAlign: "middle" }} />
                                {s.status}
                              </td>
                              <td style={{ padding: "9px 12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ background: "#94a3b8", height: "16px", width: `${barW}px`, borderRadius: "0 3px 3px 0" }} />
                                  <span style={{ fontWeight: 700, color: "#374151", minWidth: "24px" }}>{s.count}</span>
                                </div>
                              </td>
                              <td />
                              <td style={{ padding: "9px 12px" }}>
                                {isActive ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ background: s.stuckPct >= 80 ? "#ef4444" : s.stuckPct >= 50 ? "#f97316" : "#fbbf24", height: "16px", width: `${pctBarW}px`, borderRadius: "0 3px 3px 0" }} />
                                    <span style={{ fontWeight: 700, color: s.stuckPct >= 80 ? "#ef4444" : s.stuckPct >= 50 ? "#f97316" : "#d97706", minWidth: "36px" }}>
                                      {s.stuckPct > 0 ? `${s.stuckPct}%` : "—"}
                                    </span>
                                    {s.stuck > 0 && <span style={{ fontSize: "11px", color: "#9ca3af" }}>({s.stuck} cards)</span>}
                                  </div>
                                ) : <span style={{ color: "#d1d5db", fontSize: "11px" }}>não aplicável</span>}
                              </td>
                              <td />
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "11px", color: "#aaa", marginTop: "12px" }}>
                    % parados &gt;7 dias = cards criados há mais de 7 dias ainda em etapas ativas · 🟡 &lt;50% · 🟠 50–79% · 🔴 ≥80%
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
