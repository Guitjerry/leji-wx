const Promise = require('../../libs/promise.js')
const API = require('../utils/api.js')

class InvoiceService {
  constructor() {
    this.data = {}
  }

  reset() {
    this.data = {}
  }

  set(rawInvoice) {
    this.data.isInvoiceAvailable = rawInvoice.is_available
    this.data.invoiceStatusText = rawInvoice.status_text
  }

  select(invoice) {
    this.data.invoice = invoice
  }

  clear() {
    this.data.invoice = {}
  }

  edit(invoice) {
    this.data.editingInvoice = invoice
  }

  add(userService, invoice) {
    if (!invoice || !invoice.name) return false
    API.createInvoice(invoice)
    .then(res => {
      if (+res.statusCode === 200) {
        this.data.invoices.push({
          id: res.data.invoice_id,
          name: invoice.name
        })
      }
    })

    return true
  }

  remove(userService, invoice) {
    API.deleteInvoice(invoice.id)
    .then(res => {
      if (+res.statusCode === 200) {
        var index = this.data.invoices.indexOf(this.data.editingInvoice)
        this.data.invoices.splice(index, 1)
        if (this.equal(this.data.invoice, invoice)) {
          this.clear()
        }
        this.data.editingInvoice = undefined
      }
    })
  }

  update(userService, from, to) {
    if (!to || !to.name) return false
    API.updateInvoice(from.id, to)
    .then(res => {
      if (+res.statusCode === 200) {
        from = to
        if (this.equal(this.data.invoice, from)) {
          this.data.invoice = to
        }
        this.data.editingInvoice = undefined
      }
    })

    return true
  }

  equal(one, another) {
    return JSON.stringify(one) === JSON.stringify(another)
  }

  load(userService) {
    return new Promise((resolve, reject) => {
      if (userService) {
        API.getInvoiceList()
        .then(res => {
          if (+res.statusCode === 200) {
            this.data.invoices = res.data
            this.data.invoice = this.data.invoice || res.data.find(invoice => invoice.is_user_default)
            resolve(this.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
      }
    })
  }

  loadSync() {
    return this.data
  }
}

module.exports = InvoiceService
