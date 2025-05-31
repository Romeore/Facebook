import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import $ from "jquery";
import "./StatsView.css";

function StatsView({ username }) {
  const [dailyData, setDailyData] = useState([]);
  const [topByMembers, setTopByMembers] = useState([]);

  const barRef = useRef();
  const pieRef = useRef();

  useEffect(() => {
    $.ajax({
      url: "http://localhost:5000/api/posts/stats",
      headers: { username },
      success: setDailyData,
      error: console.error
    });

    $.ajax({
      url: "http://localhost:5000/api/groups/top-members",
      headers: { username },
      success: setTopByMembers,
      error: console.error
    });
  }, [username]);

  useEffect(() => {
    if (dailyData.length === 0) return;

    const svg = d3.select(barRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    svg.attr("width", width).attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(dailyData.map(d => d.day))
      .range([50, width - 20])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dailyData, d => d.count)])
      .nice()
      .range([height - 30, 20]);

    svg.append("g")
      .attr("transform", `translate(0, ${height - 30})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d.slice(5)))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(50, 0)`)
      .call(d3.axisLeft(yScale));

    svg.selectAll(".bar")
      .data(dailyData)
      .join("rect")
      .attr("x", d => xScale(d.day))
      .attr("y", d => yScale(d.count))
      .attr("height", d => height - 30 - yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("fill", "steelblue");
  }, [dailyData]);

  useEffect(() => {
    if (topByMembers.length === 0) return;

    const svg = d3.select(pieRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    const pie = d3.pie().value(d => d.memberCount);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    g.selectAll("path")
      .data(pie(topByMembers))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .append("title")
      .text(d => `${d.data.name}: ${d.data.memberCount} members`);

    g.selectAll("text")
      .data(pie(topByMembers))
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(d => d.data.name);
  }, [topByMembers]);

  return (
    <div className="stats-container">
      <div className="charts-row">
        <div className="chart-block">
          <h2>Total Posts Per Day</h2>
          <svg ref={barRef}></svg>
        </div>

        <div className="chart-block">
          <h2>Top 10 Groups by Member Count</h2>
          <svg ref={pieRef}></svg>
        </div>
      </div>
    </div>
  );
}

export default StatsView;
