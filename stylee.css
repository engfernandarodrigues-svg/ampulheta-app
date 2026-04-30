/* ===== Fundo roxo elegante ===== */
body {
  font-family: 'Lato', sans-serif;
  background: #0b0613;
  background-image:
    radial-gradient(ellipse at 30% 20%, rgba(120, 60, 180, 0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 80%, rgba(60, 20, 100, 0.30) 0%, transparent 55%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e8dcc8;
}

/* ===== Container principal ===== */
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px 48px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(160, 80, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  min-width: 320px;
  max-width: 400px;
  width: 100%;
}

/* ===== Logo ===== */
.logo-container {
  margin-bottom: 20px;
}

.logo {
  max-width: 180px;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(180, 100, 255, 0.4));
}

/* ===== Controles ===== */
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  width: 100%;
}

/* ===== Entradas de tempo ===== */
.time-inputs {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.input-group label {
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(200, 150, 255, 0.6);
  text-transform: uppercase;
}

.input-group input {
  width: 72px;
  padding: 10px 8px;
  font-size: 20px;
  font-family: 'Cinzel', serif;
  text-align: center;
  border: 1px solid rgba(160, 80, 255, 0.4);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #d8b4ff;
  outline: none;
  transition: 0.2s;
}

.input-group input:focus {
  border-color: rgba(200, 120, 255, 0.9);
  background: rgba(255, 255, 255, 0.08);
}

.sep {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  color: rgba(200, 150, 255, 0.6);
  margin-bottom: 10px;
}

/* ===== Botões ===== */
.buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 9px 18px;
  font-size: 11px;
  font-family: 'Cinzel', serif;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid rgba(160, 80, 255, 0.4);
  border-radius: 7px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  color: #d8b4ff;
  transition: all 0.2s ease;
}

.btn:hover {
  background: rgba(160, 80, 255, 0.2);
  border-color: rgba(200, 120, 255, 0.9);
  color: #f0d4ff;
}

.btn:active {
  transform: scale(0.96);
}

/* ===== Botão principal ===== */
.btn.primary {
  background: linear-gradient(135deg, #6a11cb, #9b4dff, #6a11cb);
  color: white;
  border-color: #9b4dff;
  font-weight: 600;
}

.btn.primary:hover {
  background: linear-gradient(135deg, #8e2de2, #c084fc, #8e2de2);
}

/* ===== Botões rápidos ===== */
.quick-times {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn.quick {
  background: rgba(160, 80, 255, 0.15);
  border-color: rgba(160, 80, 255, 0.5);
  color: #d8b4ff;
}

.btn.quick:hover {
  background: rgba(160, 80, 255, 0.3);
  border-color: rgba(200, 120, 255, 0.9);
}

/* ===== Display ===== */
.display {
  font-family: 'Cinzel', serif;
  font-size: 42px;
  font-weight: 600;
  color: #e0c3ff;
  letter-spacing: 4px;
  margin: 16px 0 20px;
  text-shadow: 0 0 25px rgba(180, 100, 255, 0.4);
  min-height: 54px;
}

/* ===== Canvas ===== */
canvas {
  display: block;
  filter: drop-shadow(0 8px 32px rgba(140, 60, 255, 0.25));
}

/* ===== Mensagem final ===== */
.done-msg {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 3px;
  color: #d8b4ff;
  text-transform: uppercase;
  margin-top: 16px;
  text-align: center;
  opacity: 0;
  transition: 0.4s;
}

.done-msg.visible {
  opacity: 1;
}

/* ===== Penalidade ===== */
.penalidade {
  display: none;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
  animation: boloEntrada 0.7s ease both;
}

.penalidade.visivel {
  display: flex;
}

@keyframes boloEntrada {
  0% { opacity: 0; transform: scale(0.4) translateY(40px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.penalidade-texto {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  color: #e0c3ff;
  text-align: center;
  margin-bottom: 16px;
}

.bolo-svg {
  width: 160px;
  height: 160px;
  filter: drop-shadow(0 6px 24px rgba(200, 100, 255, 0.4));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.penalidade-sub {
  font-size: 13px;
  color: rgba(200, 150, 255, 0.6);
  margin-top: 12px;
  text-align: center;
}
