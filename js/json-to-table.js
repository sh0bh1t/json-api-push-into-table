/*
 * Open-source project - https://github.com/afshinm/Json-to-HTML-Table
 */
function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText) {
    var italic = "<i>{0}</i>";
    var link = linkText ? '<a href="{0}">' + linkText + "</a>" : '<a href="{0}">{0}</a>';
    var idMarkup = tableId ? ' id="' + tableId + '"' : "";
    var classMarkup = tableClassName ? ' class="' + tableClassName + '"' : "";
    var tbl = '<table class="table table-bordered" ' + idMarkup + classMarkup + ">{0}{1}</table>";
    var th = "<thead>{0}</thead>";
    var tb = "<tbody>{0}</tbody>";
    var tr = "<tr>{0}</tr>";
    var thRow = "<th>{0}</th>";
    var tdRow = "<td>{0}</td>";
    var thCon = "";
    var tbCon = "";
    var trCon = "";
    if (parsedJson) {
        var isStringArray = typeof parsedJson[0] == "string";
        var headers;
        if (isStringArray) thCon += thRow.format("value");
        else {
            if (typeof parsedJson[0] == "object") {
                headers = array_keys(parsedJson[0]);
                for (i = 0; i < headers.length; i++) thCon += thRow.format(headers[i])
            }
        }
        th = th.format(tr.format(thCon));
        if (isStringArray) {
            for (i = 0; i < parsedJson.length; i++) {
                tbCon += tdRow.format(parsedJson[i]);
                trCon += tr.format(tbCon);
                tbCon = ""
            }
        } else {
            if (headers) {
                var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
                var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);
                for (i = 0; i < parsedJson.length; i++) {
                    for (j = 0; j < headers.length; j++) {
                        var value = parsedJson[i][headers[j]];
                        var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);
                        if (isUrl) tbCon += tdRow.format(link.format(value));
                        else {
                            if (value) {
                                if (typeof value == "object") {
                                    tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText))
                                } else {
                                    tbCon += tdRow.format(value)
                                }
                            } else {
                                tbCon += tdRow.format(italic.format(value).toUpperCase())
                            }
                        }
                    }
                    trCon += tr.format(tbCon);
                    tbCon = ""
                }
            }
        }
        tb = tb.format(trCon);
        tbl = tbl.format(th, tb);
        return tbl
    }
    return null
}
function array_keys(e, t, n) {
    var r = typeof t !== "undefined",
        i = [],
        s = !! n,
        o = true,
        u = "";
    if (e && typeof e === "object" && e.change_key_case) {
        return e.keys(t, n)
    }
    for (u in e) {
        if (e.hasOwnProperty(u) && u !== "_id") {
            o = true;
            if (r) {
                if (s && e[u] !== t) o = false;
                else if (e[u] != t) o = false
            }
            if (o) i[i.length] = u
        }
    }
    return i
}
String.prototype.format = function () {
    var e = arguments;
    return this.replace(/{(\d+)}/g,

    function (t, n) {
        return typeof e[n] != "undefined" ? e[n] : "{" + n + "}"
    })
}