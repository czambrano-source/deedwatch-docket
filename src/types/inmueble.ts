export interface Inmueble {
  Id: string;
  Name: string;
  Opportunity__r?: { Name?: string };
  Ciudad_Inmueble__c?: string;
  Departamento__c?: string;
  Direccion__c?: string;
  Nombre_de_edificio_o_conjunto__c?: string;
  Tipo_de_inmueble__c?: string;
  Torre__c?: string;
  Numero_de_apartamento__c?: string;
  chip_apartamento__c?: string;
  Numero_matricula_inmobiliaria__c?: string;
  Fiduciaria__c?: string;
  Parqueadero__c?: number;
  numero_del_parqueadero__c?: string | null;
  No_Matricula_Inmo_Parqueadero__c?: string | null;
  chip_parqueadero__c?: string;
  Deposito__c?: string;
  No_Matricula_Inmo_Deposito__c?: string | null;
  chip_deposito__c?: string;
  Proceso_entrega_inmueble__c?: string;
  nombre_ctl_inmueble__c?: string;
  nit_ctl_inmueble__c?: string;
  nombre_ctl_parqueadero__c?: string;
  nit_ctl_parqueadero__c?: string;
  nombre_ctl_bodega__c?: string;
  nit_ctl_bodega__c?: string;
  Legales__r?: {
    totalSize?: number;
    done?: boolean;
    records?: Array<{ Fecha_firma_escritura__c?: string }>;
  };
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
