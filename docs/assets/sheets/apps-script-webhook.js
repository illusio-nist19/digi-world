/**
 * Digi World — Google Apps Script web app
 * 1. Paste into Extensions → Apps Script of the orders spreadsheet
 * 2. File → Project settings → Script properties:
 *      WEBHOOK_SECRET = (same as backend SHEET_WEBHOOK_SECRET)
 * 3. Deploy → Web app → Execute as Me → Who has access: Anyone
 * 4. Paste the web app URL into EasyPanel SHEET_WEBHOOK_URL
 *
 * Tabs: "orders" (headers from orders-template.csv), "contacts" (auto).
 */

const ORDER_HEADERS = [
  "type",
  "order_id",
  "created_at",
  "status",
  "customer_name",
  "customer_email",
  "locale",
  "currency",
  "subtotal",
  "discount",
  "upsell_total",
  "grand_total",
  "items_json",
  "offer_types",
  "upsell_sku",
  "upsell_accepted",
  "source",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
  "sccid",
  "fbp",
  "fbc",
  "landing_page",
  "referrer",
  "user_agent",
  "ip",
  "event_id_purchase",
  "event_id_lead",
  "checkout_mode",
  "notes",
];

const CONTACT_HEADERS = [
  "created_at",
  "name",
  "email",
  "message",
  "locale",
  "ip",
];

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: "digi-world-sheet" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET") || "";
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");
    const sent =
      (body && body.secret) ||
      (e && e.parameter && e.parameter.secret) ||
      header_(e, "X-Webhook-Secret") ||
      "";
    if (!expected || sent !== expected) {
      return json_({ ok: false, error: "unauthorized" });
    }
    const ss = SpreadsheetApp.getActive();

    if (body.type === "contact") {
      const sh = sheet_(ss, "contacts", CONTACT_HEADERS);
      sh.appendRow(
        CONTACT_HEADERS.map(function (h) {
          if (h === "created_at") return body.created_at || new Date().toISOString();
          return body[h] == null ? "" : body[h];
        })
      );
      return json_({ ok: true, tab: "contacts" });
    }

    const sh = sheet_(ss, "orders", ORDER_HEADERS);
    const row = ORDER_HEADERS.map(function (h) {
      if (h === "created_at") return body.created_at || new Date().toISOString();
      if (h === "type") return body.type || "order";
      if (h === "items_json" && typeof body.items_json !== "string") {
        return JSON.stringify(body.items_json || body.items || []);
      }
      const v = body[h];
      return v == null ? "" : v;
    });
    sh.appendRow(row);
    return json_({ ok: true, tab: "orders", order_id: body.order_id || "" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function sheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function header_(e, name) {
  try {
    if (e.headers) {
      return e.headers[name] || e.headers[name.toLowerCase()] || "";
    }
  } catch (err) {}
  return "";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Apps Script web apps do not reliably expose custom headers to doPost.
 * Backend MUST also send ?secret=SHEET_WEBHOOK_SECRET on the URL OR
 * put "secret" in the JSON body. Preferred: body.secret + header.
 * Backend should send JSON field "secret" matching WEBHOOK_SECRET.
 */
