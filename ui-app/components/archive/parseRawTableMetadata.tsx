import { Columns } from "@/types";

export const rawData = `
	[PP_SOURCE_OF_REFERRAL_OP] [varchar](2) NULL,
	[PP_DATE_FIRST_SEEN] [varchar](10) NULL,
	[PP_PROF_REG_ISSUER_CODE_CONS_FIRST_SEEN] [varchar](2) NULL,
	[PP_PROF_REG_ENTRY_ID_CONS_FIRST_SEEN] [varchar](32) NULL,
	[PP_ORG_SITE_PROV_FIRST_SEEN] [varchar](9) NULL,
	[PP_DATE_FIRST_SEEN_CANCER_SPECIALIST] [varchar](10) NULL,
	[PP_ORG_SITE_ID_PROV_FIRST_CANCER_SPECIALIST] [varchar](9) NULL,
	[NPP_SOURCE_OF_REFERRAL_FOR] [varchar](2) NULL,
	[NPP_DATE_FIRST_SEEN] [varchar](10) NULL,
	[NPP_ORG_SITE_ID_PROV_FIRST_SEEN] [varchar](2) NULL,
	[ORG_SITE_ID_OF_IMAGING] [varchar](9) NULL,
	[PROCEDURE_DATE_CANCER_IMAGING] [varchar](10) NULL,
	[IMAGING_REPORT_TEXT] [varchar](max) NULL,
	[IMAGING_CODE_NICIP] [varchar](6) NULL,
	[IMAGING_CODE_SNOWMED_CT] [varchar](19) NULL,
	[CANCER_IMAGING_MODALITY] [varchar](4) NULL,
	[IMAGING_ANATOMICAL_SITE] [varchar](5) NULL,
	[ANATOMICAL_SIDE_IMAGING] [varchar](1) NULL,
	[ORGANISATION_SITE_IDENTIFIER_OF_IMAGING2] [varchar](9) NULL,
`;

export const parseColumns = (data: string, table: string): Columns[] => {
  const lines = data.trim().split("\n");
  return lines.map((line) => {
    const match = line.match(/\[(.*?)\] \[(.*?)\](?:\((\d+)\))?(.*)/);
    if (!match) {
      throw new Error(`Invalid line format: ${line}`);
    }

    const [, name, data_type, max_length, rest] = match;
    const primary = rest.includes("IDENTITY");
    const description = rest.includes("NOT NULL") ? "Required" : "Optional";

    return {
      name,
      data_type,
      primary,
      max_length: max_length ? parseInt(max_length, 10) : undefined,
      description,
      table,
    };
  });
};

const columns: Columns[] = parseColumns(rawData, "COSD");
console.log(columns);
