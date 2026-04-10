"""
Salary vs Cost of Living Analysis — Data Analyst (AR, US, Remote LATAM)
========================================================================
Generates publication-ready charts for LinkedIn and GitHub portfolio.

Author: Facundo Ramírez Boll
Date: April 2026
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import os

# ── CONFIG ──────────────────────────────────────────────────────────────
plt.rcParams.update({
    "figure.facecolor": "#0d1117",
    "axes.facecolor": "#0d1117",
    "axes.edgecolor": "#1b2332",
    "axes.labelcolor": "#8b99ad",
    "text.color": "#e8edf5",
    "xtick.color": "#8b99ad",
    "ytick.color": "#8b99ad",
    "grid.color": "#1b2332",
    "grid.alpha": 0.6,
    "font.family": "sans-serif",
    "font.size": 11,
    "figure.dpi": 150,
})

COLORS = {
    "Argentina Local": "#34d399",
    "Remoto LATAM": "#fbbf24",
    "EEUU Local": "#60a5fa",
}
SENIORITY_ORDER = ["Junior", "Semi Senior", "Senior"]
CHART_DIR = os.path.join(os.path.dirname(__file__), "..", "charts")
os.makedirs(CHART_DIR, exist_ok=True)

# ── LOAD DATA ───────────────────────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "salary_vs_cost_of_living_2025.csv")
df = pd.read_csv(DATA_PATH)
df["seniority"] = pd.Categorical(df["seniority"], categories=SENIORITY_ORDER, ordered=True)


def save(fig, name):
    path = os.path.join(CHART_DIR, name)
    fig.savefig(path, bbox_inches="tight", pad_inches=0.3)
    plt.close(fig)
    print(f"  ✓ Saved: {path}")


# ── CHART 1: Salary comparison by scenario and seniority ────────────────
def chart_salary_comparison():
    fig, axes = plt.subplots(1, 3, figsize=(16, 5), sharey=True)
    fig.suptitle(
        "Salary Comparison by Scenario — Data Analyst (USD/month)",
        fontsize=14, fontweight="bold", y=1.02
    )

    for ax, sen in zip(axes, SENIORITY_ORDER):
        sub = df[df["seniority"] == sen].drop_duplicates("scenario")
        x = np.arange(len(sub))
        w = 0.25
        bars_min = ax.bar(x - w, sub["salary_min_usd"], w, label="Min", color="#374151", edgecolor="#4b5563")
        bars_avg = ax.bar(x, sub["salary_avg_usd"], w, label="Avg", color="#fbbf24", edgecolor="#d97706")
        bars_max = ax.bar(x + w, sub["salary_max_usd"], w, label="Max", color="#60a5fa", edgecolor="#3b82f6")

        ax.set_title(sen, fontsize=12, fontweight="bold", pad=10)
        ax.set_xticks(x)
        ax.set_xticklabels(sub["scenario"].map(lambda s: s.replace(" ", "\n")), fontsize=9)
        ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"${v/1000:.1f}k"))
        ax.grid(axis="y", alpha=0.3)

        # Value labels on avg bars
        for bar in bars_avg:
            h = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2, h + 100, f"${int(h):,}",
                    ha="center", va="bottom", fontsize=8, fontweight="bold", color="#fbbf24")

    axes[0].set_ylabel("USD / month")
    axes[0].legend(fontsize=8, loc="upper left")
    save(fig, "01_salary_comparison.png")


# ── CHART 2: Cost of living breakdown by city ───────────────────────────
def chart_cost_breakdown():
    cost_cols = ["rent_usd", "expensas_usd", "utilities_usd", "transport_usd", "groceries_usd", "health_usd"]
    labels = ["Rent", "Building fees", "Utilities", "Transport", "Groceries", "Health"]
    colors = ["#60a5fa", "#818cf8", "#fbbf24", "#fb923c", "#34d399", "#f87171"]

    cities_data = df.drop_duplicates("city").sort_values("total_cost_usd")
    fig, ax = plt.subplots(figsize=(12, 6))

    y = np.arange(len(cities_data))
    left = np.zeros(len(cities_data))

    for col, label, color in zip(cost_cols, labels, colors):
        vals = cities_data[col].values
        ax.barh(y, vals, left=left, height=0.6, label=label, color=color, edgecolor="#0d1117", linewidth=0.5)
        left += vals

    # Total labels
    for i, total in enumerate(cities_data["total_cost_usd"].values):
        ax.text(total + 50, i, f"${int(total):,}", va="center", fontsize=10, fontweight="bold", color="#e8edf5")

    ax.set_yticks(y)
    flag_map = {"AR": "🇦🇷", "US": "🇺🇸"}
    ax.set_yticklabels([f"{row['city']}" for _, row in cities_data.iterrows()], fontsize=11)
    ax.set_xlabel("USD / month")
    ax.set_title("Monthly Cost of Living Breakdown — Studio Apartment, Single Person",
                 fontsize=13, fontweight="bold", pad=15)
    ax.legend(loc="lower right", fontsize=9, ncol=3)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"${int(v):,}"))
    ax.grid(axis="x", alpha=0.3)
    save(fig, "02_cost_breakdown.png")


# ── CHART 3: Net savings comparison ────────────────────────────────────
def chart_savings():
    fig, axes = plt.subplots(1, 3, figsize=(18, 7), sharey=True)
    fig.suptitle(
        "Net Monthly Savings by City & Scenario — Data Analyst (USD/month)",
        fontsize=14, fontweight="bold", y=1.02
    )

    for ax, sen in zip(axes, SENIORITY_ORDER):
        sub = df[df["seniority"] == sen].sort_values("savings_net_usd", ascending=True)
        colors_bar = [COLORS.get(row["scenario"], "#888") if row["savings_net_usd"] >= 0 else "#f87171"
                      for _, row in sub.iterrows()]
        labels = [f"{row['city']} ({row['scenario'].split()[0]})" for _, row in sub.iterrows()]

        bars = ax.barh(range(len(sub)), sub["savings_net_usd"], color=colors_bar, height=0.65, edgecolor="#0d1117")
        ax.set_yticks(range(len(sub)))
        ax.set_yticklabels(labels, fontsize=8)
        ax.set_title(sen, fontsize=12, fontweight="bold", pad=10)
        ax.axvline(0, color="#4e5a6e", linewidth=0.8)
        ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"${int(v):,}"))
        ax.grid(axis="x", alpha=0.3)

        for bar, val in zip(bars, sub["savings_net_usd"]):
            x = bar.get_width()
            ax.text(x + (80 if x >= 0 else -80), bar.get_y() + bar.get_height()/2,
                    f"${int(val):,}", va="center", ha="left" if x >= 0 else "right",
                    fontsize=7, fontweight="bold", color="#e8edf5")

    axes[0].set_xlabel("Net Savings (USD/month)")
    save(fig, "03_net_savings.png")


# ── CHART 4: Purchasing power ratio ────────────────────────────────────
def chart_ratio():
    fig, ax = plt.subplots(figsize=(12, 8))
    sub = df[df["seniority"] == "Semi Senior"].sort_values("salary_cost_ratio", ascending=True)

    labels = [f"{row['city']} — {row['scenario']}" for _, row in sub.iterrows()]
    ratios = sub["salary_cost_ratio"].values
    colors_bar = ["#34d399" if r >= 4 else "#fbbf24" if r >= 2.5 else "#60a5fa" if r >= 1.5 else "#f87171"
                  for r in ratios]

    bars = ax.barh(range(len(sub)), ratios, color=colors_bar, height=0.6, edgecolor="#0d1117")
    ax.set_yticks(range(len(sub)))
    ax.set_yticklabels(labels, fontsize=10)
    ax.set_xlabel("Salary / Cost of Living Ratio")
    ax.set_title("Purchasing Power Ratio — Semi Senior Data Analyst",
                 fontsize=13, fontweight="bold", pad=15)
    ax.axvline(1, color="#f87171", linewidth=1, linestyle="--", alpha=0.5)
    ax.grid(axis="x", alpha=0.3)

    for bar, val in zip(bars, ratios):
        ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
                f"{val:.1f}x", va="center", fontsize=10, fontweight="bold", color="#e8edf5")

    # Legend
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor="#34d399", label="≥ 4x Excellent"),
        Patch(facecolor="#fbbf24", label="2.5x–4x Comfortable"),
        Patch(facecolor="#60a5fa", label="1.5x–2.5x Tight"),
        Patch(facecolor="#f87171", label="< 1.5x Deficit"),
    ]
    ax.legend(handles=legend_elements, loc="lower right", fontsize=9)
    save(fig, "04_purchasing_power_ratio.png")


# ── CHART 5: Salary progression curves ──────────────────────────────────
def chart_progression():
    fig, ax = plt.subplots(figsize=(10, 6))

    for scenario_name, color in COLORS.items():
        sub = df[df["scenario"] == scenario_name].drop_duplicates("seniority").sort_values("seniority")
        ax.plot(sub["seniority"], sub["salary_avg_usd"], marker="o", markersize=10,
                linewidth=3, color=color, label=scenario_name, zorder=5)

        for _, row in sub.iterrows():
            ax.annotate(f"${int(row['salary_avg_usd']):,}",
                        (row["seniority"], row["salary_avg_usd"]),
                        textcoords="offset points", xytext=(0, 14),
                        ha="center", fontsize=9, fontweight="bold", color=color)

    ax.set_ylabel("Average Salary (USD/month)")
    ax.set_title("Salary Progression: Junior → Semi Senior → Senior",
                 fontsize=13, fontweight="bold", pad=15)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"${v/1000:.1f}k"))
    ax.grid(axis="y", alpha=0.3)
    ax.legend(fontsize=10)
    save(fig, "05_salary_progression.png")


# ── CHART 6: LinkedIn hero chart (salary vs cost side by side) ──────────
def chart_linkedin_hero():
    fig, ax = plt.subplots(figsize=(14, 6))

    sen_data = df[df["seniority"] == "Semi Senior"]
    cities_unique = sen_data.drop_duplicates("city")["city"].tolist()

    # For each city, show cost bar and salary bars for applicable scenarios
    y_pos = []
    y_labels = []
    bar_data = []

    idx = 0
    for city in ["Corrientes", "Buenos Aires", "Córdoba", "Austin TX", "Miami FL", "New York NY"]:
        city_rows = sen_data[sen_data["city"] == city]
        cost = city_rows.iloc[0]["total_cost_usd"]

        for _, row in city_rows.iterrows():
            bar_data.append({
                "y": idx,
                "label": f"{row['city']} ({row['scenario'].split()[0]})",
                "salary": row["salary_avg_usd"],
                "cost": cost,
                "scenario": row["scenario"],
            })
            idx += 1
        idx += 0.3  # gap between cities

    ys = [d["y"] for d in bar_data]

    # Cost bars (red-ish)
    ax.barh(ys, [d["cost"] for d in bar_data], height=0.55, color="#f8717133", edgecolor="#f87171",
            linewidth=0.8, label="Cost of Living")

    # Salary bars
    for d in bar_data:
        color = COLORS.get(d["scenario"], "#888")
        ax.barh(d["y"], d["salary"], height=0.55, color=color + "88", edgecolor=color,
                linewidth=0.8)

    ax.set_yticks(ys)
    ax.set_yticklabels([d["label"] for d in bar_data], fontsize=9)
    ax.set_title("Semi Senior Data Analyst: Salary (colored) vs Cost of Living (red outline)",
                 fontsize=12, fontweight="bold", pad=15)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda v, _: f"${int(v):,}"))
    ax.grid(axis="x", alpha=0.3)

    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor="#34d39988", edgecolor="#34d399", label="AR Local salary"),
        Patch(facecolor="#fbbf2488", edgecolor="#fbbf24", label="Remote LATAM salary"),
        Patch(facecolor="#60a5fa88", edgecolor="#60a5fa", label="US Local salary"),
        Patch(facecolor="#f8717133", edgecolor="#f87171", label="Cost of living"),
    ]
    ax.legend(handles=legend_elements, loc="lower right", fontsize=9)
    save(fig, "06_linkedin_hero.png")


# ── MAIN ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n📊 Generating charts...\n")
    chart_salary_comparison()
    chart_cost_breakdown()
    chart_savings()
    chart_ratio()
    chart_progression()
    chart_linkedin_hero()
    print(f"\n✅ All charts saved to {CHART_DIR}/")
    print("\n📋 Quick stats:")
    print(f"   Total records: {len(df)}")
    print(f"   Scenarios: {df['scenario'].nunique()}")
    print(f"   Cities: {df['city'].nunique()}")
    print(f"   Seniority levels: {df['seniority'].nunique()}")

    ssr = df[df["seniority"] == "Semi Senior"]
    best = ssr.loc[ssr["salary_cost_ratio"].idxmax()]
    worst = ssr.loc[ssr["salary_cost_ratio"].idxmin()]
    print(f"\n   Best purchasing power (Semi Sr): {best['city']} ({best['scenario']}) → {best['salary_cost_ratio']:.1f}x")
    print(f"   Worst purchasing power (Semi Sr): {worst['city']} ({worst['scenario']}) → {worst['salary_cost_ratio']:.1f}x")
