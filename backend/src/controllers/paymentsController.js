import { pool } from '../db.js'

export async function fetchPayments(req, res) {
  const [rows] = await pool.query('SELECT p.*, e.name AS event_name, e.status AS event_status FROM payments p JOIN events e ON p.event_id = e.id ORDER BY p.created_at DESC LIMIT 200')
  res.json({ success: true, data: rows })
}

export async function createPayment(req, res) {
  const { eventId, amount, paymentType, status, proofUrl } = req.body
  if (!eventId || !amount || !paymentType) {
    return res.status(400).json({ success: false, error: 'Event ID, amount and payment type are required' })
  }

  const [result] = await pool.query('INSERT INTO payments (event_id, amount, payment_type, status, proof_url) VALUES (?, ?, ?, ?, ?)', [eventId, amount, paymentType, status || 'unpaid', proofUrl || null])
  if (status === 'paid') {
    await pool.query('UPDATE events SET paid_amount = paid_amount + ? WHERE id = ?', [amount, eventId])
  }

  res.status(201).json({ success: true, data: { paymentId: result.insertId } })
}

export async function updatePayment(req, res) {
  const id = Number(req.params.id)
  const { amount, status, proofUrl } = req.body
  await pool.query('UPDATE payments SET amount = ?, status = ?, proof_url = ? WHERE id = ?', [amount, status, proofUrl, id])
  res.json({ success: true, message: 'Payment updated' })
}

export async function getPayment(req, res) {
  const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [Number(req.params.id)])
  if (!rows[0]) {
    return res.status(404).json({ success: false, error: 'Payment not found' })
  }
  res.json({ success: true, data: rows[0] })
}
