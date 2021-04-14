import { message } from "antd";
// @ts-ignore
import { JSEncrypt } from "jsencrypt";
import { RcFile } from "antd/lib/upload";
import moment from "moment";
import { showAuthMessage } from "redux/actions/Auth";
import store from "redux/store";
import Cookies from "js-cookie";
import { DOMAIN } from "configs/AppConfig";
import HttpService from "api";
import { MANAGE_TOKEN, TOKEN } from "constants/ApiConstant";

class Utils {
  static getNameInitial(name: string) {
    let initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  }

  static getRouteInfo(navTree: any, path: any): any {
    if (navTree.path === path) {
      return navTree;
    }
    let route;
    for (let p in navTree) {
      if (navTree.hasOwnProperty(p) && typeof navTree[p] === "object") {
        route = this.getRouteInfo(navTree[p], path);
        if (route) {
          return route;
        }
      }
    }
    return route;
  }
  static encryptInput(input: string, publicKey: any): any {
    const jsEncrypt = new JSEncrypt({});
    jsEncrypt.setPublicKey(publicKey);
    return jsEncrypt.encrypt(input);
  }

  static getColorContrast(hex: any) {
    const threshold = 130;
    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);
    function hexToR(h: any) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h: any) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h: any) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }
    function cutHex(h: any) {
      return h.charAt(0) === "#" ? h.substring(1, 7) : h;
    }
    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "dark";
    } else {
      return "light";
    }
  }

  static shadeColor(color: any, percent: any) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(String((R * (100 + percent)) / 100));
    G = parseInt(String((G * (100 + percent)) / 100));
    B = parseInt(String((B * (100 + percent)) / 100));
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    const RR =
      R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);
    return `#${RR}${GG}${BB}`;
  }

  static getSignNum(number: number, positive: any, negative: any) {
    if (number > 0) {
      return positive;
    }
    if (number < 0) {
      return negative;
    }
    return null;
  }

  static antdTableSorter(a: any, b: any, key: any) {
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      return a[key] - b[key];
    }

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      a = a[key].toLowerCase();
      b = b[key].toLowerCase();
      return a > b ? -1 : b > a ? 1 : 0;
    }
    return;
  }

  static filterArray(list: any, key: any, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item: any) => item[key] === value);
    }
    return data;
  }
  static deleteArrayRow<T>(list: T[], key: keyof T, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item) => item[key] !== value);
    }
    return data;
  }

  static wildCardSearch<T>(list: T[], input: string) {
    list = list.filter((item) => {
      for (let key in item) {
        if (item[key] == null || key === "Photo" || key === "Logo") {
          continue;
        }
        if (
          item[key]
            //@ts-ignore
            .toString()
            .toUpperCase()
            .indexOf(input.toString().toUpperCase()) !== -1
        ) {
          return true;
        }
      }
    });
    return list;
  }

  static getBreakPoint(screens: any) {
    let breakpoints: any[] = [];
    for (const key in screens) {
      if (screens.hasOwnProperty(key)) {
        const element = screens[key];
        if (element) {
          breakpoints.push(key);
        }
      }
    }
    return breakpoints;
  }

  static getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  static beforeUpload(file: any) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 0.3;

    if (!isLt2M) {
      message.error("Image must be smaller than 300kb!");
    }
    return isJpgOrPng && isLt2M;
  }

  static beforeUploadNumbers(file: RcFile): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const isCsvOrTxt =
          file.type === "text/csv" || file.type === "text/plain";
        if (!isCsvOrTxt) {
          message.error("You can only upload CSV/TXT file!");
        }
        if (isCsvOrTxt) {
          resolve(true);
        } else {
          reject();
        }
      };
    });
  }

  static dummyRequest({ onSuccess }: any) {
    setTimeout(() => {
      onSuccess("ok");
    });
  }

  static sortData(array: any, key: any) {
    return array.slice().sort((a: any, b: any) => a[key] - b[key]);
  }

  static handleDotNetDate(date: any) {
    return moment(date).format("[/Date(]xZZ[)/]");
  }

  static fromDotNetDate(date: any) {
    try {
      return moment(new Date(parseInt(date.substr(6)))).format("DD-MM-YYYY");
    } catch {
      return "Unknown date";
    }
  }

  static toMilliSeconds(date: string) {
    const newDate = new Date(date);
    return newDate.getMilliseconds();
  }
  static parseToTicks(date: number): number {
    return date * 10000 + 621355968000000000;
  }

  static printElement(elem: any) {
    var mywindow = window.open("", "PRINT", "height=600,width=800");

    mywindow!.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow!.document.write("</head><body >");
    mywindow!.document.write("<h1>" + document.title + "</h1>");
    mywindow!.document.write(
      (document.querySelector(".print-button")!.innerHTML = "")
    );
    mywindow!.document.write(document.querySelector(elem).innerHTML);
    mywindow!.document.write("</body></html>");

    mywindow!.document.close(); // necessary for IE >= 10
    mywindow!.focus(); // necessary for IE >= 10*/

    mywindow!.print();
    mywindow!.close();
  }

  static printElementAlt(elem: any) {
    document.querySelector(elem).style = "padding: 100";
    var printContents = document.querySelector(elem).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    window.location.reload();
  }

  static padNumber(elem: any) {
    // Add 0000 before numbers, ex. 00001, 00023, 01567
    return ("00000" + elem).substring(elem.length);
  }

  static setManageToken(id: string, value: any) {
    Cookies.set(`${MANAGE_TOKEN}_${id}`, value, {
      domain: DOMAIN,
      path: "/",
    });
  }

  static setToken(value: any) {
    Cookies.set(TOKEN, value, { expires: 1, domain: DOMAIN, path: "/" });
  }

  static removeToken() {
    Cookies.remove(TOKEN, { expires: 1, domain: DOMAIN, path: "/" });
  }
  static removeManageToken() {
    Cookies.remove(`${MANAGE_TOKEN}_${new HttpService().company_id}`, {
      domain: DOMAIN,
      path: "/",
    });
  }

  static removeAllTokens() {
    Utils.removeToken();
    Utils.removeManageToken();
  }
  static isAscii(text: string) {
    if (/^[\x00-\x7F]*$/.test(text)) return true;
  }

  static CSVToArray(strData: any, strDelimiter = ",") {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      // Delimiters.
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches: any = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      var strMatchedValue: any = null;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      // @ts-ignore
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
  }

  static getLargestArray(arr: any[]) {
    let largest = 0,
      largestOrigin = [];
    for (let i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] > largest) {
          largest = arr[i][j];
          largestOrigin = arr[i];
        }
      }
    }
    return largestOrigin;
  }

  static createTable(ar: any[]) {
    return `<table>${ar.reduce(
      (c, o) =>
        (c += `<tr>${o.reduce(
          (c: any, d: any) => (c += `<td>${d}</td>`),
          ""
        )}</tr>`),
      ""
    )}</table>`;
  }
}

export default Utils;
