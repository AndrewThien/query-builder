export interface TableMetaData {
  section: string;
  column_name: string;
  data_type: string;
  column_description: string;
  sensitive: boolean;
}

export interface ResearchViewTable {
  table: string;
  columns: Columns[];
}

export interface Columns {
  name: string;
  data_type: string;
  primary: boolean;
  max_length?: number;
  description: string;
}
