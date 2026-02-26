"use client";

import { useState } from "react";
import styles from "./order.module.scss";

type Kit = {
    id: string;
    name: string;
    description: string;
    subtotal: number;
};

const KITS: Kit[] = [
    { id: "starter", name: "Starter Kit", description: "Basics to get going", subtotal: 29.99 },
    { id: "balance", name: "Balance Kit", description: "Daily routine + tracker", subtotal: 49.99 },
    { id: "pro", name: "Pro Kit", description: "Full program bundle", subtotal: 79.99 },
];

export default function OrderPage() {
    const [kitId, setKitId] = useState<string>(KITS[0].id);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locStatus, setLocStatus] = useState<"idle" | "loading" | "ready" | "denied" | "error">("idle");
    const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success">("idle");

    const kit = KITS.find((k) => k.id === kitId)!;

    const getLocation = () => {
        if (!("geolocation" in navigator)) {
            setLocStatus("error");
            return;
        }

        setLocStatus("loading");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
                setLocStatus("ready");
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) setLocStatus("denied");
                else setLocStatus("error");
            }
        );
    };

    const canSubmit = Boolean(coords) && submitStatus !== "submitting";

    const placeOrder = () => {
        if (!coords) return;

        setSubmitStatus("submitting");

        const payload = {
            kitId: kit.id,
            subtotal: kit.subtotal,
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: new Date().toISOString(),
        };

        console.log("ORDER PAYLOAD:", payload);

        setSubmitStatus("success");
    };

    return (
        <main className={styles.block}>
            <h1 className={styles.block__title}>Order a kit</h1>

            <div className={styles.block__kitCard}>
                <h2 className={styles['block__kitCard-heading']}>1) Choose a kit</h2>

                {KITS.map((k) => (
                    <label key={k.id} className={styles['block__kitCard-label']}>
                        <input
                            type="radio"
                            name="kit"
                            value={k.id}
                            checked={kitId === k.id}
                            onChange={() => setKitId(k.id)}
                        />
                        <b>{k.name}</b> — ${k.subtotal.toFixed(2)}
                        <div>{k.description}</div>
                    </label>
                ))}
            </div>

            <div className={styles.block}>
                <h2 className={styles.block__title}>2) Location</h2>

                <div className={styles.block__location}>
                    <button
                        className={styles['block__location-button']}
                        type="button"
                        onClick={getLocation}
                        disabled={locStatus === "loading"}
                    >
                        {locStatus === "loading" ? "Getting location..." : "Get my location"}
                    </button>

                    {locStatus === "ready" && coords && (
                        <span className={styles['block__location-success']}>
                            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                        </span>
                    )}

                    {locStatus === "denied" && (
                        <span className={styles['block__location-error']}>
                            Permission denied.
                        </span>
                    )}

                    {locStatus === "error" && (
                        <span className={styles['block__location-error']}>
                            Couldn’t get location.
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.block}>
                <h2 className={styles.block__title}>3) Summary</h2>

                <div className={styles.block__summary}>
                    <div>Kit: <b>{kit.name}</b></div>
                    <div>Subtotal: <b>${kit.subtotal.toFixed(2)}</b></div>
                    <div className={styles['block__summary-muted']}>
                        Customer pays only the kit subtotal.
                    </div>
                </div>

                <div className={styles.block__location}>
                    <button
                        className={styles['block__location-button']}
                        type="button"
                        onClick={placeOrder}
                        disabled={!canSubmit}
                    >
                        {submitStatus === "submitting" ? "Placing..." : "Place order"}
                    </button>

                    {!coords && (
                        <span className={styles['block__location-error']}>
                          Get location first.
                        </span>
                    )}

                    {submitStatus === "success" && (
                        <span className={styles['block__location-success']}>
                            Logged to console
                        </span>
                    )}
                </div>
            </div>
        </main>
    );
}