"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface ExportActionsProps {
    order: any;
}

export function ExportActions({ order }: ExportActionsProps) {

    function exportToPDF() {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Order #${order.id.slice(0, 8)}`, 14, 30);
        doc.text(`Date: ${format(new Date(order.created_at), "PPP")}`, 14, 36);
        doc.text(`Status: ${order.status.toUpperCase()}`, 14, 42);

        // Customer Details
        doc.text("Bill To:", 14, 55);
        doc.setFontSize(10);
        doc.text(order.shipping_address?.fullName || "Guest", 14, 60);
        doc.text(order.email || "", 14, 65);
        doc.text(order.shipping_address?.addressLine1 || "", 14, 70);
        doc.text(`${order.shipping_address?.city}, ${order.shipping_address?.state} ${order.shipping_address?.postalCode}`, 14, 75);

        // Items Table
        const tableColumn = ["Item", "Qty", "Price", "Total"];
        const tableRows: any[] = [];

        order.order_items.forEach((item: any) => {
            const itemData = [
                item.product_name,
                item.quantity,
                `${item.currency} ${item.price_amount}`,
                `${item.currency} ${(item.price_amount * item.quantity).toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 85,
        });

        // Totals
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Total Paid: ${order.currency} ${order.total_amount}`, 140, finalY);

        doc.save(`invoice-${order.id.slice(0, 8)}.pdf`);
    }

    function exportToExcel() {
        const wb = XLSX.utils.book_new();

        // Flatten Data
        const data = order.order_items.map((item: any) => ({
            "Order ID": order.id,
            "Date": format(new Date(order.created_at), "yyyy-MM-dd HH:mm"),
            "Customer Name": order.shipping_address?.fullName,
            "Customer Email": order.email,
            "Product": item.product_name,
            "Quantity": item.quantity,
            "Unit Price": item.price_amount,
            "Total Price": item.price_amount * item.quantity,
            "Currency": item.currency,
            "Status": order.status
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Order Details");
        XLSX.writeFile(wb, `order-${order.id.slice(0, 8)}.xlsx`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToPDF}>
                    <FileText className="w-4 h-4 mr-2" />
                    Download PDF Invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export to Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
