const xlsx = require('xlsx');
const fs = require('fs');

const getDataExcel = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('The file does not exist at the provided path.');
        }

        const buffer = fs.readFileSync(filePath);

        const workbook = xlsx.read(buffer, { type: 'buffer' });

        // Get the first worksheet from the workbook
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet data to JSON format
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Delete the uploaded file after reading it
        fs.unlinkSync(filePath);

        return data;
    } catch (error) {
        throw new Error(`Error processing the Excel file: ${error.message}`);
    }
}

module.exports = { getDataExcel }