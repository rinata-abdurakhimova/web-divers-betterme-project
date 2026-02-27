const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function createOrder(data: {
    lat: number;
    lon: number;
    subtotal: number;
}) {
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
    }

    return response.json();
}

export async function getOrders(params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
}) {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.from) query.append("from", params.from);
    if (params?.to) query.append("to", params.to);

    const queryString = query.toString();
    const url = queryString
        ? `${API_URL}/orders?${queryString}`
        : `${API_URL}/orders`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return response.json();
}

export async function importOrders(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/orders/import`, {
        method: "POST",
        body: formData,
    });


    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
    }

    return response.json();
}