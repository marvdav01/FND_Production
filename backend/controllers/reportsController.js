import { pool } from '../config/db.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const ExcelJS = require('exceljs')
const { jsPDF } = require('jspdf')
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable')

export async function exportEventsExcel(req, res) {
  try {
    const [events] = await pool.query(`
      SELECT e.*, u.name AS client_name 
      FROM events e 
      JOIN users u ON e.client_id = u.id 
      ORDER BY e.event_date DESC
    `)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Events')

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nama Event', key: 'name', width: 30 },
      { header: 'Tanggal', key: 'event_date', width: 15 },
      { header: 'Client', key: 'client_name', width: 30 },
      { header: 'Lokasi', key: 'location', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Total Amount', key: 'total_amount', width: 20 },
    ]

    events.forEach(e => {
      worksheet.addRow({
        ...e,
        event_date: new Date(e.event_date).toLocaleDateString('id-ID')
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Events.xlsx')

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('Export Excel error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

export async function exportEventsPDF(req, res) {
  try {
    const [events] = await pool.query(`
      SELECT e.*, u.name AS client_name 
      FROM events e 
      JOIN users u ON e.client_id = u.id 
      ORDER BY e.event_date DESC
    `)

    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text("Laporan Performa & Keuangan", 14, 22)
    doc.setFontSize(11)
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30)

    const tableData = events.map(e => [
      e.name,
      new Date(e.event_date).toLocaleDateString('id-ID'),
      e.client_name,
      e.status.toUpperCase(),
      `Rp ${Number(e.total_amount).toLocaleString('id-ID')}`
    ])

    autoTable(doc, {
      startY: 40,
      head: [['Nama Event', 'Tanggal', 'Client', 'Status', 'Total']],
      body: tableData,
    })

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_FND.pdf')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('Export PDF error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
