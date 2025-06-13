// Utility functions cho in hóa đơn

export const printConfig = {
    // Cấu hình print options
    printOptions: {
        documentTitle: (id, date) => `Hoa-don-${id}-${date}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 15mm 10mm;
            }
            @media print {
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #000;
                }
                .no-print {
                    display: none !important;
                }
            }
        `,
    },

    // Delay before print để đảm bảo content đã load
    printDelay: 100,

    // Format cho số tiền
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount).replace('₫', 'đ');
    },

    // Format cho ngày tháng
    formatDate: (date, format = 'DD/MM/YYYY') => {
        const moment = require('moment-timezone');
        return moment(date).tz('Asia/Ho_Chi_Minh').format(format);
    },

    // Validate dữ liệu trước khi in
    validatePrintData: (detail, orders) => {
        const errors = [];
        
        if (!detail) {
            errors.push('Thiếu thông tin chi tiết booking');
        }
        
        if (!detail?.fullname) {
            errors.push('Thiếu tên khách hàng');
        }
        
        if (!detail?.phone) {
            errors.push('Thiếu số điện thoại khách hàng');
        }
        
        if (!detail?.roomTitle) {
            errors.push('Thiếu thông tin phòng');
        }
        
        if (!detail?.summaryPrice) {
            errors.push('Thiếu thông tin giá phòng');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Tạo số hóa đơn theo format
    generateInvoiceNumber: (id, prefix = 'HD') => {
        const timestamp = Date.now().toString().slice(-6);
        return `${prefix}${id}-${timestamp}`;
    }
};

// Hook để sử dụng print functionality
export const usePrintInvoice = () => {
    const print = (contentRef, options = {}) => {
        const defaultOptions = {
            onBeforeGetContent: () => new Promise(resolve => {
                setTimeout(resolve, printConfig.printDelay);
            }),
            onAfterPrint: () => {
                console.log('In hóa đơn thành công!');
            },
            removeAfterPrint: false,
            ...options
        };

        return defaultOptions;
    };

    return { print };
};

export default printConfig;
