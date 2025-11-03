import { GoogleSpreadsheet } from 'google-spreadsheet';

// Estas informações você obterá do arquivo de credenciais JSON baixado
const SPREADSHEET_ID = 'seu_spreadsheet_id'; // ID da sua planilha
const SHEET_ID = 'seu_sheet_id'; // ID da aba específica (opcional)
const CLIENT_EMAIL = 'seu_client_email'; // Do arquivo de credenciais
const PRIVATE_KEY = 'sua_private_key'; // Do arquivo de credenciais

export const loadSheetData = async () => {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Autenticação usando as credenciais de serviço
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });

    // Carrega as informações da planilha
    await doc.loadInfo();

    // Obtém a primeira aba da planilha (ou use doc.sheetsById[SHEET_ID] para uma aba específica)
    const sheet = doc.sheetsByIndex[0];

    // Carrega todas as linhas
    const rows = await sheet.getRows();

    // Mapeia as linhas para o formato esperado pela aplicação
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      date: row.date,
      photo: row.photo
    }));

  } catch (error) {
    console.error('Erro ao carregar dados do Google Sheets:', error);
    return [];
  }
};