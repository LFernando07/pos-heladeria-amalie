import JsBarCode from "jsbarcode";

export const generateBarCode = (idVenta) => {
  const canvas = document.createElement("canvas");
  canvas.id = "barcode";

  JsBarCode(canvas, idVenta, {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: true,
  });

  return canvas.toDataURL("image/png");
};
