"use client";

import { useEffect, useState, useRef } from "react";
import { getOrders, importOrders } from "@/services/api"
import styles from "./admin.module.scss";

type Order = {
    id: number;
    latitude: number;
    longitude: number;
    subtotal: number;
    composite_tax_rate: number;
    tax_amount: number;
    total_amount: number;
    breakdown: any;
    jurisdictions: string[];
    timestamp: string;
};

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await getOrders();
                setOrders(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <main className={styles.admin}>
            <div className={styles.admin__import}>
                <h2 className={styles.admin__importTitle}>Import CSV</h2>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className={styles.admin__fileInput}
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                        }
                    }}
                />

                <button
                    className={styles.admin__button}
                    disabled={!file || importing}
                    onClick={async () => {
                        if (!file) return;

                        try {
                            setImporting(true);
                            await importOrders(file);
                            setFile(null);

                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                            alert("Import successful");

                            const response = await getOrders();
                            setOrders(response.data);
                        } catch (err) {
                            console.error(err);
                            alert("Import failed");
                        } finally {
                            setImporting(false);
                        }
                    }}
                >
                    {importing ? "Importing..." : "Upload CSV"}
                </button>
            </div>

            <h1 className={styles.admin__title}>Orders</h1>

            <table className={styles.admin__table}>
                <thead className={styles.admin__thead}>
                <tr className={styles.admin__row}>
                    <th className={styles.admin__cell}>ID</th>
                    <th className={styles.admin__cell}>Subtotal</th>
                    <th className={styles.admin__cell}>Tax</th>
                    <th className={styles.admin__cell}>Total</th>
                    <th className={styles.admin__cell}>Timestamp</th>
                </tr>
                </thead>

                <tbody className={styles.admin__tbody}>
                {orders.map((order) => (
                    <tr key={order.id} className={styles.admin__row}>
                        <td className={styles.admin__cell}>{order.id}</td>
                        <td className={styles.admin__cell}>{order.subtotal}</td>
                        <td className={styles.admin__cell}>{order.tax_amount}</td>
                        <td className={styles.admin__cell}>{order.total_amount}</td>
                        <td className={styles.admin__cell}>
                            {new Date(order.timestamp).toLocaleString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}