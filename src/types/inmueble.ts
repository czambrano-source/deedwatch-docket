export interface Inmueble {
  Id: string;
  Name: string;
  Nombre_de_edificio_o_conjunto__c?: string;
  Direccion__c?: string;
  Ciudad_Inmueble__c?: string;
  Departamento__c?: string;
  Torre__c?: string;
  Numero_de_apartamento__c?: string;
  Numero_matricula_inmobiliaria__c?: string;
  chip_apartamento__c?: string;
  Fiduciaria__c?: string;
  Fecha_firma_escritura__c?: string;
  numero_del_parqueadero__c?: string;
  No_Matricula_Inmo_Parqueadero__c?: string;
  Deposito__c?: string;
  No_Matricula_Inmo_Deposito__c?: string;
  Proceso_entrega_inmueble__c?: string;
  Cliente__c?: string;
  [key: string]: any;
}

export interface GestionPredial {
  id: string;
  salesforce_id: string;
  nombre_inmueble?: string;
  anio_vigencia?: number;
  fecha_pago?: string;
  valor_pago?: number;
  valor_avaluo?: number;
  url_soporte?: string;
  notas?: string;
  estado?: string;
  created_at?: string;
}
