"use client";

import { useState } from "react";
import styles from "./order.module.scss";
import { createOrder } from "@/services/api";

type Kit = {
    id: string;
    name: string;
    description: string;
    subtotal: number;
};

type OrderResponse = {
    subtotal: number;
    composite_tax_rate: number;
    tax_amount: number;
    total_amount: number;
    breakdown: {
        state_rate: number;
        county_rate: number;
        city_rate: number;
        special_rates: number;
    };
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
    const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    const handleSubmit = async () => {
        if (!coords) {
            setErrorMessage("Get location first.");
            return;
        }

        try {
            setSubmitStatus("submitting");
            setErrorMessage(null);

            const result = await createOrder({
                lat: coords.latitude,
                lon: coords.longitude,
                subtotal: kit.subtotal,
            });

            setOrderResult(result);
            setSubmitStatus("success");

        } catch (error) {
            setSubmitStatus("error");

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unknown error occurred");
            }
        }
    };

    return (
        <main className={styles.block}>
            <h1 className={styles.block__title}>Order a kit</h1>

            <div className={styles.block__item}>
                <h2 className={styles['block__item-heading']}>1) Choose a kit</h2>

                {KITS.map((k) => (
                    <label key={k.id} className={styles['block__item-label']}>
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

            <div className={styles.block__item}>
                <h2 className={styles['block__item-heading']}>2) Location</h2>

                <div className={styles['block__item-location']}>
                    <button
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
                        <span className={styles['block__item-location_error']}>
                            Permission denied.
                        </span>
                    )}

                    {locStatus === "error" && (
                        <span className={styles['block__item-location_error']}>
                            Couldn’t get location.
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.block__item}>
                <h2 className={styles['block__item-heading']}>3) Summary</h2>

                <div className={styles['block__item-summary']}>
                    <div>Kit: <b>{kit.name}</b></div>
                    <div>Subtotal: <b>${kit.subtotal.toFixed(2)}</b></div>
                    <div className={styles['block__item-summary_muted']}>
                        Customer pays only the kit subtotal.
                    </div>
                </div>

                <div className={styles['block__item-location']}>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitStatus === "submitting"}
                    >
                        {submitStatus === "submitting" ? "Placing..." : "Place order"}
                    </button>

                    {errorMessage && (
                        <span className={styles["block__item-location-error"]}>
                        {errorMessage}
                      </span>
                    )}

                    {submitStatus === "success" && (
                        <span className={styles["block__item-location-success"]}>
                            Order created successfully.
                        </span>
                    )}
                </div>
            </div>
            {orderResult && (
                <div className={styles.block__result}>
                    <h2>Order Summary</h2>

                    <p>Subtotal: ${orderResult.subtotal.toFixed(2)}</p>
                    <p>Tax rate: {(orderResult.composite_tax_rate * 100).toFixed(3)}%</p>
                    <p>Tax amount: ${orderResult.tax_amount.toFixed(2)}</p>
                    <p><strong>Total: ${orderResult.total_amount.toFixed(2)}</strong></p>

                    <h3>Breakdown</h3>
                    <p>State: {(orderResult.breakdown.state_rate * 100).toFixed(3)}%</p>
                    <p>County: {(orderResult.breakdown.county_rate * 100).toFixed(3)}%</p>
                    <p>City: {(orderResult.breakdown.city_rate * 100).toFixed(3)}%</p>
                    <p>Special: {(orderResult.breakdown.special_rates * 100).toFixed(3)}%</p>
                </div>
            )}
        </main>
    );
}