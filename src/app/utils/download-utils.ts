export function downloadDocument(queryParam: any, type: any, router: any, partnerData: any) {
  switch (type) {
    case 'TAP wise':
      router.navigate(['downloadInvoice/tapWise'], {
        state: {
          isEdit: true,
          selectPlanDataMap: JSON.parse(queryParam),
          // partnerData: JSON.parse(partnerData),
        },
      });
      break;
    case 'Passenger wise':
      router.navigate(['downloadInvoice'], {
        state: {
          isEdit: true,
          selectPlanDataMap: JSON.parse(queryParam),
        },
      });
      break;
    case 'Note':
      router.navigate(['downloadInvoice/view-download-note'], {
        state: {
          isEdit: true,
          selectDataMap: JSON.parse(queryParam),
        },
      });
      break;
    case 'Cheque':
      router.navigate(['downloadInvoice/receipt-download-cheque'], {
        state: {
          isEdit: true,
          receiptItem: JSON.parse(queryParam),
        },
      });
      break;
    case 'Cash':
      router.navigate(['downloadInvoice/receipt-download-cash'], {
        state: {
          isEdit: true,
          receiptItem: JSON.parse(queryParam),
        },
      });
      break;
    case 'Digital':
      router.navigate(['downloadInvoice/receipt-download-digital'], {
        state: {
          isEdit: true,
          receiptItem: JSON.parse(queryParam),
        },
      });
      break;
    case 'Upi':
      router.navigate(['downloadInvoice/receipt-download-upi'], {
        state: {
          isEdit: true,
          receiptItem: JSON.parse(queryParam),
        },
      });
      break;
    case 'NEFT/RTGS':
      router.navigate(['downloadInvoice/receipt-download-neft'], {
        state: {
          isEdit: true,
          receiptItem: JSON.parse(queryParam),
        },
      });
      break;
  }
}
