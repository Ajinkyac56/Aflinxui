export function getBasicAmountExcludingGst(includingGstAmount: any, gstPer: any) {
  var GSTAmountCalculated = includingGstAmount - includingGstAmount * (100 / (100 + parseFloat(gstPer)));
  return includingGstAmount - GSTAmountCalculated;
}
