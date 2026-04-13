(function () {
  const THEME = {
    canvas: {
      width: 960,
      height: 600,
      margin: { top: 70, right: 40, bottom: 60, left: 80 }
    },
    font: {
      family: "Inter, Arial, Helvetica, sans-serif",
      title: 20,
      subtitle: 14,
      axisLabel: 14,
      tick: 12,
      panel: 13
    },
    line: {
      axis: 1.5,
      grid: 0.75,
      main: 3,
      baseline: 2,
      policy: 2.5,
      handleStroke: 2
    },
    radius: {
      marker: 5,
      handle: 7
    },
    dash: {
      baseline: [8, 6],
      policy: [10, 6],
      guide: [3, 4],
      guess: [6, 5]
    },
    color: {
      background: "#ffffff",
      frame: "#d9dee5",
      axis: "#444444",
      grid: "#e8edf4",
      text: "#1f2937",
      muted: "#6b7280",
      demand: "#2F6BFF",
      supply: "#D84A3A",
      longRun: "#555555",
      government: "#2E8B57",
      guess: "#7C3AED",
      baseline: "#A3AAB5",
      output: "#2F6BFF",
      inflation: "#E07A00",
      policyRate: "#2E8B57",
      external: "#C97B00",
      centralBank: "#6B4CE6",
      csFill: "rgba(47,107,255,0.18)",
      psFill: "rgba(216,74,58,0.18)",
      govtFill: "rgba(46,139,87,0.20)",
      dwlFill: "rgba(120,120,120,0.24)",
      buyerTaxFill: "rgba(255,165,0,0.22)",
      sellerTaxFill: "rgba(128,0,128,0.22)"
    }
  };

  function getPlotArea(theme = THEME) {
    const m = theme.canvas.margin;
    return {
      left: m.left,
      top: m.top,
      right: theme.canvas.width - m.right,
      bottom: theme.canvas.height - m.bottom,
      width: theme.canvas.width - m.left - m.right,
      height: theme.canvas.height - m.top - m.bottom
    };
  }

  function clearCanvas(ctx, theme = THEME) {
    ctx.clearRect(0, 0, theme.canvas.width, theme.canvas.height);
    ctx.fillStyle = theme.color.background;
    ctx.fillRect(0, 0, theme.canvas.width, theme.canvas.height);
  }

  function drawFrame(ctx, theme = THEME) {
    ctx.save();
    ctx.strokeStyle = theme.color.frame;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, theme.canvas.width - 1, theme.canvas.height - 1);
    ctx.restore();
  }

  function drawAxes(ctx, options = {}) {
    const theme = options.theme || THEME;
    const plot = getPlotArea(theme);
    const xLabel = options.xLabel || "";
    const yLabel = options.yLabel || "";
    const showGrid = options.showGrid !== false;
    const xTicks = options.xTicks || [];
    const yTicks = options.yTicks || [];

    ctx.save();
    ctx.font = `${theme.font.tick}px ${theme.font.family}`;
    ctx.fillStyle = theme.color.text;
    ctx.strokeStyle = theme.color.axis;
    ctx.lineWidth = theme.line.axis;

    if (showGrid) {
      ctx.strokeStyle = theme.color.grid;
      ctx.lineWidth = theme.line.grid;
      xTicks.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(t.x, plot.top);
        ctx.lineTo(t.x, plot.bottom);
        ctx.stroke();
      });
      yTicks.forEach(t => {
        ctx.beginPath();
        ctx.moveTo(plot.left, t.y);
        ctx.lineTo(plot.right, t.y);
        ctx.stroke();
      });
    }

    ctx.strokeStyle = theme.color.axis;
    ctx.lineWidth = theme.line.axis;
    ctx.beginPath();
    ctx.moveTo(plot.left, plot.top);
    ctx.lineTo(plot.left, plot.bottom);
    ctx.lineTo(plot.right, plot.bottom);
    ctx.stroke();

    ctx.fillStyle = theme.color.text;
    xTicks.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(t.x, plot.bottom);
      ctx.lineTo(t.x, plot.bottom + 5);
      ctx.stroke();
      if (t.label !== undefined) {
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(String(t.label), t.x, plot.bottom + 8);
      }
    });

    yTicks.forEach(t => {
      ctx.beginPath();
      ctx.moveTo(plot.left - 5, t.y);
      ctx.lineTo(plot.left, t.y);
      ctx.stroke();
      if (t.label !== undefined) {
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(String(t.label), plot.left - 8, t.y);
      }
    });

    ctx.font = `500 ${theme.font.axisLabel}px ${theme.font.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(xLabel, (plot.left + plot.right) / 2, theme.canvas.height - theme.canvas.margin.bottom + 28);

    ctx.save();
    ctx.translate(theme.canvas.margin.left - 48, (plot.top + plot.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    ctx.restore();
  }

  function drawLine(ctx, points, options = {}) {
    if (!points || points.length < 2) return;
    const theme = options.theme || THEME;
    ctx.save();
    ctx.strokeStyle = options.color || theme.color.text;
    ctx.lineWidth = options.lineWidth || theme.line.main;
    if (options.dash) ctx.setLineDash(options.dash);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawCircle(ctx, x, y, options = {}) {
    const theme = options.theme || THEME;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, options.radius || theme.radius.marker, 0, Math.PI * 2);
    ctx.fillStyle = options.fill || "#ffffff";
    ctx.fill();
    ctx.lineWidth = options.lineWidth || theme.line.handleStroke;
    ctx.strokeStyle = options.stroke || theme.color.text;
    ctx.stroke();
    ctx.restore();
  }

  function fillPolygon(ctx, points, options = {}) {
    if (!points || points.length < 3) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = options.fill || "rgba(0,0,0,0.1)";
    ctx.fill();
    if (options.stroke) {
      ctx.strokeStyle = options.stroke;
      ctx.lineWidth = options.lineWidth || 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawText(ctx, text, x, y, options = {}) {
    const theme = options.theme || THEME;
    ctx.save();
    ctx.font = `${options.weight || "400"} ${options.size || theme.font.panel}px ${theme.font.family}`;
    ctx.fillStyle = options.color || theme.color.text;
    ctx.textAlign = options.align || "left";
    ctx.textBaseline = options.baseline || "alphabetic";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function valueToX(value, min, max, theme = THEME) {
    const plot = getPlotArea(theme);
    if (max === min) return plot.left;
    return plot.left + ((value - min) / (max - min)) * plot.width;
  }

  function valueToY(value, min, max, theme = THEME) {
    const plot = getPlotArea(theme);
    if (max === min) return plot.bottom;
    return plot.bottom - ((value - min) / (max - min)) * plot.height;
  }

  function xToValue(x, min, max, theme = THEME) {
    const plot = getPlotArea(theme);
    return min + ((x - plot.left) / plot.width) * (max - min);
  }

  function yToValue(y, min, max, theme = THEME) {
    const plot = getPlotArea(theme);
    return max - ((y - plot.top) / plot.height) * (max - min);
  }

  window.ECON_THEME = THEME;
  window.EconDraw = {
    clamp,
    clearCanvas,
    drawAxes,
    drawCircle,
    drawFrame,
    drawLine,
    drawText,
    fillPolygon,
    getPlotArea,
    valueToX,
    valueToY,
    xToValue,
    yToValue
  };
})();
