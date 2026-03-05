<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Life - Next Gen Simulation</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-pink: #ff6b9d;
            --primary-purple: #c44569;
            --light-pink: #ffdde1;
            --light-purple: #ee9ca7;
            --dark-purple: #5f27cd;
            --soft-purple: #a29bfe;
            --cream: #fff5f7;
            --glass-bg: rgba(255, 255, 255, 0.25);
            --glass-border: rgba(255, 255, 255, 0.4);
            --success: #2ecc71;
            --warning: #f39c12;
            --danger: #e74c3c;
        }

        body {
            font-family: 'Nunito', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffecd2 100%);
            min-height: 100vh;
            overflow-x: hidden;
            transition: filter 0.5s ease;
        }

        body.night-mode {
            filter: brightness(0.7) contrast(1.1);
        }

        body.rainy {
            filter: grayscale(0.3) brightness(0.8);
        }

        /* Animated Weather Effects */
        .weather-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            display: none;
        }

        .weather-overlay.active {
            display: block;
        }

        .rain {
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="20" y1="0" x2="15" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><line x1="60" y1="0" x2="55" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><line x1="90" y1="0" x2="85" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1"/></svg>');
            animation: rain 0.5s linear infinite;
        }

        @keyframes rain {
            0% { background-position: 0 0; }
            100% { background-position: 0 100px; }
        }

        .snow {
            background: radial-gradient(circle, white 2px, transparent 2px);
            background-size: 50px 50px;
            animation: snow 3s linear infinite;
            opacity: 0.8;
        }

        @keyframes snow {
            0% { background-position: 0 0; }
            100% { background-position: 50px 200px; }
        }

        /* Background Animation */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }

        .floating-shape {
            position: absolute;
            opacity: 0.15;
            animation: float 20s infinite ease-in-out;
        }

        .shape-1 { top: 10%; left: 10%; width: 80px; height: 80px; background: white; border-radius: 50%; animation-delay: 0s; }
        .shape-2 { top: 70%; right: 10%; width: 120px; height: 120px; background: white; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; animation-delay: 5s; }
        .shape-3 { bottom: 10%; left: 30%; width: 60px; height: 60px; background: white; transform: rotate(45deg); animation-delay: 10s; }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(180deg); }
        }

        /* Character Creation Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        }

        .character-creation {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 221, 225, 0.95));
            padding: 2rem;
            border-radius: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
            border: 3px solid rgba(255, 107, 157, 0.3);
        }

        .creation-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .creation-header h1 {
            color: var(--dark-purple);
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
        }

        .avatar-preview {
            width: 150px;
            height: 150px;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            border-radius: 50%;
            margin: 0 auto 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            border: 5px solid white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .avatar-preview::after {
            content: '✨';
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.5rem;
            animation: sparkle 2s infinite;
        }

        @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        .customization-section {
            margin-bottom: 1.5rem;
        }

        .customization-section h3 {
            color: var(--dark-purple);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .option-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
        }

        .option-btn {
            padding: 0.8rem;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Nunito', sans-serif;
            font-weight: 600;
        }

        .option-btn:hover, .option-btn.selected {
            border-color: var(--primary-pink);
            background: linear-gradient(135deg, var(--light-pink), var(--light-purple));
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
        }

        .stat-allocation {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }

        .stat-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: white;
            padding: 1rem;
            border-radius: 12px;
            border: 2px solid #e0e0e0;
        }

        .stat-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .stat-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }

        .stat-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .stat-btn {
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 50%;
            background: var(--primary-pink);
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s ease;
        }

        .stat-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
        }

        .stat-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .stat-value {
            font-weight: 700;
            color: var(--dark-purple);
            min-width: 30px;
            text-align: center;
        }

        .major-selection {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }

        .major-card {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 16px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .major-card:hover, .major-card.selected {
            border-color: var(--primary-pink);
            background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(196, 69, 105, 0.1));
            transform: translateY(-3px);
        }

        .major-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .start-game-btn {
            width: 100%;
            padding: 1.2rem;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 1.3rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 2rem;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
        }

        .start-game-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 107, 157, 0.5);
        }

        /* Main Game Interface */
        .game-container {
            display: none;
            height: 100vh;
            padding: 80px 20px 20px;
            gap: 20px;
            position: relative;
            z-index: 2;
        }

        .game-container.active {
            display: grid;
            grid-template-columns: 300px 1fr 350px;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Glass Panel Style */
        .panel {
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .panel-header {
            background: linear-gradient(135deg, rgba(255, 107, 157, 0.9), rgba(196, 69, 105, 0.9));
            color: white;
            padding: 1.2rem;
            font-weight: 700;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .panel-header i {
            font-size: 1.2rem;
        }

        /* Top HUD */
        .top-hud {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-bottom: 2px solid rgba(255, 107, 157, 0.2);
        }

        .hud-left {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .player-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            border: 3px solid white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .player-avatar:hover {
            transform: scale(1.1);
        }

        .player-info h3 {
            color: var(--dark-purple);
            font-size: 1.1rem;
            margin-bottom: 2px;
        }

        .player-info .level {
            color: var(--primary-purple);
            font-size: 0.85rem;
            font-weight: 600;
        }

        .hud-center {
            display: flex;
            gap: 2rem;
        }

        .stat-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .stat-bar {
            width: 100px;
            height: 8px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }

        .stat-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s ease;
        }

        .stat-label {
            font-size: 0.75rem;
            color: var(--dark-purple);
            font-weight: 700;
        }

        .hud-right {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .time-display {
            background: linear-gradient(135deg, var(--dark-purple), var(--soft-purple));
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .currency {
            background: linear-gradient(135deg, #f39c12, #f1c40f);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .notification-bell {
            position: relative;
            width: 40px;
            height: 40px;
            background: rgba(255, 107, 157, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--primary-pink);
            font-size: 1.2rem;
        }

        .notification-bell:hover {
            background: rgba(255, 107, 157, 0.2);
            transform: scale(1.1);
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--danger);
            color: white;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 700;
        }

        /* Left Panel: Character & Relationships */
        .character-panel {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
        }

        .stats-section {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .stats-section h4 {
            color: var(--dark-purple);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .skill-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            padding: 0.5rem;
            background: white;
            border-radius: 10px;
        }

        .skill-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .skill-icon {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }

        .skill-bar {
            width: 80px;
            height: 6px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }

        .skill-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-pink), var(--primary-purple));
            border-radius: 10px;
            transition: width 0.5s ease;
        }

        .relationships-list {
            margin-top: 1rem;
        }

        .relationship-card {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 16px;
            padding: 1rem;
            margin-bottom: 0.8rem;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .relationship-card:hover {
            transform: translateX(5px);
            border-color: var(--primary-pink);
            box-shadow: 0 4px 15px rgba(255, 107, 157, 0.2);
        }

        .rel-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--soft-purple), var(--primary-pink));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            border: 3px solid white;
            position: relative;
        }

        .rel-status {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background: var(--success);
            border: 2px solid white;
            border-radius: 50%;
        }

        .rel-info {
            flex: 1;
        }

        .rel-name {
            font-weight: 700;
            color: var(--dark-purple);
            margin-bottom: 2px;
        }

        .rel-level {
            font-size: 0.8rem;
            color: var(--primary-purple);
        }

        .hearts {
            color: var(--danger);
            font-size: 0.9rem;
        }

        /* Center Panel: Campus Map & Activities */
        .campus-area {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
        }

        .campus-map {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 24px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            position: relative;
            min-height: 300px;
            border: 3px solid rgba(255, 107, 157, 0.2);
        }

        .map-title {
            text-align: center;
            color: var(--dark-purple);
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
        }

        .map-locations {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
        }

        .location-node {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 3px solid transparent;
            position: relative;
            overflow: hidden;
        }

        .location-node::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 0;
        }

        .location-node:hover::before, .location-node.active::before {
            opacity: 0.1;
        }

        .location-node:hover, .location-node.active {
            transform: translateY(-5px);
            border-color: var(--primary-pink);
            box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
        }

        .location-node > * {
            position: relative;
            z-index: 1;
        }

        .location-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--light-pink), var(--light-purple));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
            color: var(--dark-purple);
            transition: all 0.3s ease;
        }

        .location-node:hover .location-icon {
            transform: scale(1.1) rotate(5deg);
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            color: white;
        }

        .location-name {
            font-weight: 700;
            color: var(--dark-purple);
            margin-bottom: 0.3rem;
        }

        .location-status {
            font-size: 0.8rem;
            color: var(--success);
            font-weight: 600;
        }

        .current-activity {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            padding: 1.5rem;
            margin-top: 1rem;
            border: 2px solid var(--primary-pink);
        }

        .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .activity-title {
            color: var(--dark-purple);
            font-weight: 700;
            font-size: 1.1rem;
        }

        .activity-timer {
            background: var(--primary-pink);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.9rem;
            font-weight: 700;
        }

        .activity-progress {
            width: 100%;
            height: 10px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 1rem;
        }

        .activity-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-pink), var(--primary-purple));
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        .activity-rewards {
            display: flex;
            gap: 1rem;
            font-size: 0.9rem;
            color: var(--dark-purple);
        }

        .reward-tag {
            background: rgba(255, 107, 157, 0.2);
            padding: 0.3rem 0.8rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .quests-panel {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 20px;
            padding: 1.5rem;
        }

        .quests-panel h3 {
            color: var(--dark-purple);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .quest-item {
            background: white;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 0.8rem;
            border-left: 4px solid var(--primary-pink);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .quest-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .quest-title {
            font-weight: 700;
            color: var(--dark-purple);
            margin-bottom: 0.3rem;
        }

        .quest-desc {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .quest-reward {
            font-size: 0.8rem;
            color: var(--warning);
            font-weight: 600;
        }

        /* Right Panel: Chat & Social */
        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .chat-tabs {
            display: flex;
            background: rgba(255, 255, 255, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .chat-tab {
            flex: 1;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            border-bottom: 3px solid transparent;
        }

        .chat-tab.active {
            color: white;
            border-bottom-color: white;
            background: rgba(255, 255, 255, 0.2);
        }

        .chat-tab:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .message {
            max-width: 85%;
            padding: 0.8rem 1rem;
            border-radius: 18px;
            font-size: 0.95rem;
            line-height: 1.4;
            animation: messageSlide 0.3s ease;
            word-wrap: break-word;
        }

        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.own {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message.other {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.9);
            color: var(--dark-purple);
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255, 107, 157, 0.2);
        }

        .message-sender {
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 0.2rem;
            opacity: 0.8;
        }

        .chat-input-area {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .input-wrapper {
            display: flex;
            gap: 0.5rem;
            background: white;
            border-radius: 25px;
            padding: 0.5rem;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .chat-input {
            flex: 1;
            border: none;
            padding: 0.5rem 1rem;
            font-family: 'Nunito', sans-serif;
            font-size: 0.95rem;
            outline: none;
            background: transparent;
        }

        .emoji-btn, .send-btn {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .emoji-btn {
            background: rgba(255, 107, 157, 0.1);
            color: var(--primary-pink);
        }

        .emoji-btn:hover {
            background: rgba(255, 107, 157, 0.2);
            transform: scale(1.1);
        }

        .send-btn {
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            color: white;
        }

        .send-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
        }

        .emoji-picker {
            position: absolute;
            bottom: 80px;
            right: 20px;
            background: white;
            border-radius: 20px;
            padding: 1rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: none;
            grid-template-columns: repeat(6, 1fr);
            gap: 0.5rem;
            z-index: 100;
            border: 2px solid var(--light-pink);
        }

        .emoji-picker.show {
            display: grid;
            animation: popIn 0.2s ease;
        }

        .emoji-option {
            cursor: pointer;
            font-size: 1.5rem;
            padding: 0.5rem;
            border-radius: 10px;
            transition: all 0.2s ease;
            text-align: center;
        }

        .emoji-option:hover {
            background: var(--light-pink);
            transform: scale(1.2);
        }

        .chat-wrapper {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        /* Event Popup */
        .event-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: white;
            padding: 2rem;
            border-radius: 30px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
            z-index: 3000;
            text-align: center;
            max-width: 500px;
            width: 90%;
            border: 3px solid var(--primary-pink);
            transition: transform 0.3s ease;
        }

        .event-popup.show {
            transform: translate(-50%, -50%) scale(1);
            animation: popIn 0.5s ease;
        }

        .event-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .event-title {
            color: var(--dark-purple);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .event-desc {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .event-choices {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .choice-btn {
            padding: 1rem 2rem;
            border: 2px solid var(--primary-pink);
            background: white;
            color: var(--primary-pink);
            border-radius: 15px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.3s ease;
        }

        .choice-btn:hover {
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
            color: white;
            transform: translateY(-2px);
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            border-left: 4px solid var(--primary-pink);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 999;
            font-weight: 600;
            color: var(--dark-purple);
            max-width: 300px;
        }

        .toast.show {
            transform: translateX(0);
        }

        .toast.success { border-left-color: var(--success); }
        .toast.warning { border-left-color: var(--warning); }
        .toast.error { border-left-color: var(--danger); }

        /* Level Up Animation */
        .levelup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 5000;
            flex-direction: column;
        }

        .levelup-overlay.show {
            display: flex;
            animation: fadeIn 0.5s ease;
        }

        .levelup-text {
            font-size: 4rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--soft-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: levelUpPop 1s ease;
            text-align: center;
        }

        @keyframes levelUpPop {
            0% { transform: scale(0) rotate(-10deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .levelup-subtext {
            color: white;
            font-size: 1.5rem;
            margin-top: 1rem;
            text-align: center;
        }

        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--primary-pink);
            animation: confetti-fall 3s linear infinite;
        }

        @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .game-container.active {
                grid-template-columns: 250px 1fr 300px;
            }
        }

        @media (max-width: 968px) {
            .game-container.active {
                grid-template-columns: 1fr;
                grid-template-rows: auto 1fr auto;
            }
            .panel {
                max-height: 400px;
            }
            .hud-center {
                display: none;
            }
        }

        /* Particles */
        .particle {
            position: fixed;
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
        }

        .particle.show {
            animation: particle-float 2s ease-out forwards;
        }

        @keyframes particle-float {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-100px) scale(0.5); }
        }
    </style>
</head>
<body>
    <!-- Weather Overlay -->
    <div class="weather-overlay" id="weatherOverlay"></div>

    <!-- Background Animation -->
    <div class="bg-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
    </div>

    <!-- Character Creation Modal -->
    <div class="modal-overlay" id="characterCreation">
        <div class="character-creation">
            <div class="creation-header">
                <h1>🌸 Create Your Character</h1>
                <p>Customize your campus life journey</p>
            </div>

            <div class="avatar-preview" id="avatarPreview">👤</div>

            <div class="customization-section">
                <h3><i class="fas fa-user"></i> Appearance</h3>
                <div class="option-grid" id="avatarOptions">
                    <button class="option-btn" onclick="selectAvatar('👩‍🎓', this)">👩‍🎓</button>
                    <button class="option-btn" onclick="selectAvatar('👨‍🎓', this)">👨‍🎓</button>
                    <button class="option-btn" onclick="selectAvatar('👩‍🎨', this)">👩‍🎨</button>
                    <button class="option-btn" onclick="selectAvatar('👨‍💻', this)">👨‍💻</button>
                    <button class="option-btn" onclick="selectAvatar('👩‍🔬', this)">👩‍🔬</button>
                    <button class="option-btn" onclick="selectAvatar('👨‍🎤', this)">👨‍🎤</button>
                    <button class="option-btn" onclick="selectAvatar('👩‍🏫', this)">👩‍🏫</button>
                    <button class="option-btn" onclick="selectAvatar('👨‍🏫', this)">👨‍🏫</button>
                </div>
            </div>

            <div class="customization-section">
                <h3><i class="fas fa-star"></i> Allocate Stats (Points: <span id="pointsLeft">10</span>)</h3>
                <div class="stat-allocation">
                    <div class="stat-row">
                        <div class="stat-info">
                            <div class="stat-icon" style="background: #e8f5e9;">🧠</div>
                            <span>Intelligence</span>
                        </div>
                        <div class="stat-controls">
                            <button class="stat-btn" onclick="changeStat('intelligence', -1)">-</button>
                            <span class="stat-value" id="stat-intelligence">5</span>
                            <button class="stat-btn" onclick="changeStat('intelligence', 1)">+</button>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-info">
                            <div class="stat-icon" style="background: #fff3e0;">💬</div>
                            <span>Charisma</span>
                        </div>
                        <div class="stat-controls">
                            <button class="stat-btn" onclick="changeStat('charisma', -1)">-</button>
                            <span class="stat-value" id="stat-charisma">5</span>
                            <button class="stat-btn" onclick="changeStat('charisma', 1)">+</button>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-info">
                            <div class="stat-icon" style="background: #e3f2fd;">💪</div>
                            <span>Fitness</span>
                        </div>
                        <div class="stat-controls">
                            <button class="stat-btn" onclick="changeStat('fitness', -1)">-</button>
                            <span class="stat-value" id="stat-fitness">5</span>
                            <button class="stat-btn" onclick="changeStat('fitness', 1)">+</button>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-info">
                            <div class="stat-icon" style="background: #f3e5f5;">🎨</div>
                            <span>Creativity</span>
                        </div>
                        <div class="stat-controls">
                            <button class="stat-btn" onclick="changeStat('creativity', -1)">-</button>
                            <span class="stat-value" id="stat-creativity">5</span>
                            <button class="stat-btn" onclick="changeStat('creativity', 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="customization-section">
                <h3><i class="fas fa-graduation-cap"></i> Choose Your Major</h3>
                <div class="major-selection">
                    <div class="major-card" onclick="selectMajor('engineering', this)">
                        <div class="major-icon">🔧</div>
                        <div>Engineering</div>
                        <small>+2 Intelligence</small>
                    </div>
                    <div class="major-card" onclick="selectMajor('arts', this)">
                        <div class="major-icon">🎨</div>
                        <div>Fine Arts</div>
                        <small>+2 Creativity</small>
                    </div>
                    <div class="major-card" onclick="selectMajor('business', this)">
                        <div class="major-icon">💼</div>
                        <div>Business</div>
                        <small>+2 Charisma</small>
                    </div>
                    <div class="major-card" onclick="selectMajor('science', this)">
                        <div class="major-icon">🔬</div>
                        <div>Science</div>
                        <small>+1 Intelligence, +1 Creativity</small>
                    </div>
                </div>
            </div>

            <div class="customization-section">
                <h3><i class="fas fa-user-tag"></i> Your Name</h3>
                <input type="text" id="playerNameInput" placeholder="Enter your name..." style="width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 12px; font-family: 'Nunito'; font-size: 1rem;">
            </div>

            <button class="start-game-btn" onclick="startGame()">
                <i class="fas fa-play"></i> Start Campus Life
            </button>
        </div>
    </div>

    <!-- Level Up Overlay -->
    <div class="levelup-overlay" id="levelupOverlay">
        <div class="levelup-text">LEVEL UP! 🎉</div>
        <div class="levelup-subtext" id="levelupText">You reached Level 2!</div>
    </div>

    <!-- Event Popup -->
    <div class="event-popup" id="eventPopup">
        <div class="event-icon" id="eventIcon">📢</div>
        <div class="event-title" id="eventTitle">Random Event</div>
        <div class="event-desc" id="eventDesc">Something happened!</div>
        <div class="event-choices" id="eventChoices">
            <button class="choice-btn" onclick="closeEvent()">OK</button>
        </div>
    </div>

    <!-- Top HUD -->
    <div class="top-hud" id="topHud" style="display: none;">
        <div class="hud-left">
            <div class="player-avatar" id="hudAvatar" onclick="showProfile()">👤</div>
            <div class="player-info">
                <h3 id="hudName">Player</h3>
                <div class="level">Level <span id="hudLevel">1</span> • <span id="hudMajor">Undeclared</span></div>
            </div>
        </div>

        <div class="hud-center">
            <div class="stat-display">
                <div class="stat-label">Energy</div>
                <div class="stat-bar">
                    <div class="stat-fill" id="energyBar" style="width: 100%; background: linear-gradient(90deg, #f39c12, #f1c40f);"></div>
                </div>
            </div>
            <div class="stat-display">
                <div class="stat-label">Happiness</div>
                <div class="stat-bar">
                    <div class="stat-fill" id="happinessBar" style="width: 80%; background: linear-gradient(90deg, #e74c3c, #f39c12);"></div>
                </div>
            </div>
            <div class="stat-display">
                <div class="stat-label">GPA</div>
                <div class="stat-bar">
                    <div class="stat-fill" id="gpaBar" style="width: 75%; background: linear-gradient(90deg, #9b59b6, #3498db);"></div>
                </div>
            </div>
        </div>

        <div class="hud-right">
            <div class="time-display" id="timeDisplay">
                <i class="fas fa-clock"></i>
                <span>Day 1 • 08:00</span>
            </div>
            <div class="currency">
                <i class="fas fa-coins"></i>
                <span id="moneyDisplay">$500</span>
            </div>
            <div class="notification-bell" onclick="showNotifications()">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" id="notifBadge">3</span>
            </div>
        </div>
    </div>

    <!-- Main Game Interface -->
    <div class="game-container" id="gameContainer">
        <!-- Left: Character Stats & Relationships -->
        <div class="panel">
            <div class="panel-header">
                <span><i class="fas fa-user-circle"></i> Character</span>
                <i class="fas fa-cog" style="cursor: pointer;" onclick="showSettings()"></i>
            </div>
            <div class="character-panel">
                <div class="stats-section">
                    <h4><i class="fas fa-chart-line"></i> Skills</h4>
                    <div class="skill-item">
                        <div class="skill-info">
                            <div class="skill-icon" style="background: #e8f5e9;">📚</div>
                            <span>Academics</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" id="skill-academics" style="width: 20%"></div>
                        </div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-info">
                            <div class="skill-icon" style="background: #fff3e0;">🎭</div>
                            <span>Social</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" id="skill-social" style="width: 15%"></div>
                        </div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-info">
                            <div class="skill-icon" style="background: #e3f2fd;">⚽</div>
                            <span>Athletics</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" id="skill-athletics" style="width: 10%"></div>
                        </div>
                    </div>
                    <div class="skill-item">
                        <div class="skill-info">
                            <div class="skill-icon" style="background: #f3e5f5;">🎨</div>
                            <span>Arts</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-progress" id="skill-arts" style="width: 5%"></div>
                        </div>
                    </div>
                </div>

                <div class="stats-section">
                    <h4><i class="fas fa-heart"></i> Relationships</h4>
                    <div class="relationships-list" id="relationshipsList">
                        <!-- Populated by JS -->
                    </div>
                </div>

                <div class="stats-section">
                    <h4><i class="fas fa-calendar"></i> Schedule</h4>
                    <div style="background: white; padding: 1rem; border-radius: 12px; font-size: 0.9rem; color: #666;">
                        <div style="margin-bottom: 0.5rem;"><strong>09:00</strong> - Morning Lecture</div>
                        <div style="margin-bottom: 0.5rem;"><strong>14:00</strong> - Club Meeting</div>
                        <div><strong>19:00</strong> - Free Time</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Center: Campus Map & Activities -->
        <div class="panel">
            <div class="panel-header">
                <span><i class="fas fa-map-marked-alt"></i> Campus Map</span>
                <span style="font-size: 0.9rem; opacity: 0.9;">Current: <span id="currentLocation">Dormitory</span></span>
            </div>
            <div class="campus-area">
                <div class="campus-map">
                    <div class="map-title">🗺️ Select a Location</div>
                    <div class="map-locations">
                        <div class="location-node" onclick="travelTo('library')" id="loc-library">
                            <div class="location-icon">📚</div>
                            <div class="location-name">Library</div>
                            <div class="location-status">Study +XP</div>
                        </div>
                        <div class="location-node" onclick="travelTo('cafe')" id="loc-cafe">
                            <div class="location-icon">☕</div>
                            <div class="location-name">Café</div>
                            <div class="location-status">Social +XP</div>
                        </div>
                        <div class="location-node" onclick="travelTo('gym')" id="loc-gym">
                            <div class="location-icon">💪</div>
                            <div class="location-name">Gym</div>
                            <div class="location-status">Fitness +XP</div>
                        </div>
                        <div class="location-node" onclick="travelTo('studio')" id="loc-studio">
                            <div class="location-icon">🎨</div>
                            <div class="location-name">Art Studio</div>
                            <div class="location-status">Creativity +XP</div>
                        </div>
                        <div class="location-node" onclick="travelTo('hall')" id="loc-hall">
                            <div class="location-icon">🎭</div>
                            <div class="location-name">Student Hall</div>
                            <div class="location-status">Events +XP</div>
                        </div>
                        <div class="location-node" onclick="travelTo('park')" id="loc-park">
                            <div class="location-icon">🌳</div>
                            <div class="location-name">Campus Park</div>
                            <div class="location-status">Relax +Energy</div>
                        </div>
                    </div>
                </div>

                <div class="current-activity" id="activityPanel" style="display: none;">
                    <div class="activity-header">
                        <div class="activity-title" id="activityTitle">Studying...</div>
                        <div class="activity-timer" id="activityTimer">02:45</div>
                    </div>
                    <div class="activity-progress">
                        <div class="activity-bar" id="activityBar" style="width: 0%"></div>
                    </div>
                    <div class="activity-rewards">
                        <span class="reward-tag"><i class="fas fa-star"></i> +<span id="xpReward">15</span> XP</span>
                        <span class="reward-tag"><i class="fas fa-brain"></i> +<span id="skillReward">2</span> Intelligence</span>
                    </div>
                    <button onclick="cancelActivity()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--danger); color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Nunito'; font-weight: 600;">Cancel</button>
                </div>

                <div class="quests-panel">
                    <h3><i class="fas fa-scroll"></i> Active Quests</h3>
                    <div class="quest-item" onclick="startQuest('study')">
                        <div class="quest-title">📚 Study for Midterms</div>
                        <div class="quest-desc">Spend 2 hours studying at the library</div>
                        <div class="quest-reward">Reward: +50 XP, +$100</div>
                    </div>
                    <div class="quest-item" onclick="startQuest('social')">
                        <div class="quest-title">☕ Make 3 New Friends</div>
                        <div class="quest-desc">Visit the café and socialize</div>
                        <div class="quest-reward">Reward: +30 XP, +Charisma</div>
                    </div>
                    <div class="quest-item" onclick="startQuest('club')">
                        <div class="quest-title">⭐ Join a Club</div>
                        <div class="quest-desc">Attend a club meeting at Student Hall</div>
                        <div class="quest-reward">Reward: +40 XP, Club Access</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right: Chat & Social -->
        <div class="panel">
            <div class="panel-header">
                <span><i class="fas fa-comments"></i> Campus Chat</span>
                <span style="font-size: 0.8rem; opacity: 0.8;"><span id="onlineCount">12</span> online</span>
            </div>
            <div class="chat-container">
                <div class="chat-tabs">
                    <div class="chat-tab active" onclick="switchTab('global', this)">Global</div>
                    <div class="chat-tab" onclick="switchTab('club', this)">Club</div>
                    <div class="chat-tab" onclick="switchTab('private', this)">DMs</div>
                </div>
                <div class="chat-wrapper">
                    <div class="chat-messages" id="chatMessages">
                        <div class="message other">
                            <div class="message-sender">Sarah 🌸 (Art Club)</div>
                            <div>Anyone want to study together at the library? 📚✨</div>
                        </div>
                        <div class="message other">
                            <div class="message-sender">Mike 🎸 (Band)</div>
                            <div>We're performing at the Student Hall tonight! Come support! 🎵</div>
                        </div>
                        <div class="message other">
                            <div class="message-sender">System 🤖</div>
                            <div>🎉 Welcome to Campus Life! Check out the quests panel to get started.</div>
                        </div>
                    </div>
                    
                    <div class="emoji-picker" id="emojiPicker">
                        <span class="emoji-option" onclick="addEmoji('😊')">😊</span>
                        <span class="emoji-option" onclick="addEmoji('😂')">😂</span>
                        <span class="emoji-option" onclick="addEmoji('❤️')">❤️</span>
                        <span class="emoji-option" onclick="addEmoji('🌸')">🌸</span>
                        <span class="emoji-option" onclick="addEmoji('🎓')">🎓</span>
                        <span class="emoji-option" onclick="addEmoji('☕')">☕</span>
                        <span class="emoji-option" onclick="addEmoji('📚')">📚</span>
                        <span class="emoji-option" onclick="addEmoji('🎵')">🎵</span>
                        <span class="emoji-option" onclick="addEmoji('🏀')">🏀</span>
                        <span class="emoji-option" onclick="addEmoji('🌟')">🌟</span>
                        <span class="emoji-option" onclick="addEmoji('✨')">✨</span>
                        <span class="emoji-option" onclick="addEmoji('🎉')">🎉</span>
                    </div>

                    <div class="chat-input-area">
                        <div class="input-wrapper">
                            <button class="emoji-btn" onclick="toggleEmojiPicker()">
                                <i class="fas fa-smile"></i>
                            </button>
                            <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                            <button class="send-btn" onclick="sendMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" id="toast"></div>

    <script>
        // Game State
        let gameState = {
            player: {
                name: '',
                avatar: '👤',
                level: 1,
                xp: 0,
                xpToNext: 100,
                major: '',
                stats: {
                    intelligence: 5,
                    charisma: 5,
                    fitness: 5,
                    creativity: 5
                },
                skills: {
                    academics: 0,
                    social: 0,
                    athletics: 0,
                    arts: 0
                },
                energy: 100,
                happiness: 80,
                gpa: 3.0,
                money: 500
            },
            time: {
                day: 1,
                hour: 8,
                minute: 0
            },
            currentLocation: 'dorm',
            relationships: [
                { name: 'Sarah', avatar: '👩‍🎨', level: 2, hearts: '❤️❤️🤍', status: 'Friend', club: 'Art Club' },
                { name: 'Mike', avatar: '👨‍🎤', level: 1, hearts: '❤️🤍🤍', status: 'Acquaintance', club: 'Music Band' },
                { name: 'Emma', avatar: '👩‍🎓', level: 3, hearts: '❤️❤️❤️', status: 'Best Friend', club: 'Study Group' }
            ],
            currentActivity: null,
            activityProgress: 0
        };

        let statPoints = 10;
        let selectedAvatar = '👤';
        let selectedMajor = '';

        // Character Creation Functions
        function selectAvatar(avatar, btn) {
            selectedAvatar = avatar;
            document.getElementById('avatarPreview').textContent = avatar;
            document.querySelectorAll('#avatarOptions .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        }

        function changeStat(stat, change) {
            const currentVal = parseInt(document.getElementById(`stat-${stat}`).textContent);
            const newVal = currentVal + change;
            
            if (newVal < 1 || newVal > 10) return;
            if (change > 0 && statPoints <= 0) return;
            if (change < 0 && currentVal <= 1) return;
            
            document.getElementById(`stat-${stat}`).textContent = newVal;
            statPoints -= change;
            document.getElementById('pointsLeft').textContent = statPoints;
            
            // Update buttons
            document.querySelectorAll('.stat-btn').forEach(btn => {
                btn.disabled = statPoints === 0 && btn.textContent === '+';
            });
        }

        function selectMajor(major, card) {
            selectedMajor = major;
            document.querySelectorAll('.major-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }

        function startGame() {
            const name = document.getElementById('playerNameInput').value.trim();
            if (!name) {
                showToast('Please enter your name! 🌸', 'warning');
                return;
            }
            if (!selectedMajor) {
                showToast('Please select a major! 🎓', 'warning');
                return;
            }

            // Initialize player
            gameState.player.name = name;
            gameState.player.avatar = selectedAvatar;
            gameState.player.major = selectedMajor;
            gameState.player.stats.intelligence = parseInt(document.getElementById('stat-intelligence').textContent);
            gameState.player.stats.charisma = parseInt(document.getElementById('stat-charisma').textContent);
            gameState.player.stats.fitness = parseInt(document.getElementById('stat-fitness').textContent);
            gameState.player.stats.creativity = parseInt(document.getElementById('stat-creativity').textContent);

            // Apply major bonuses
            if (selectedMajor === 'engineering') gameState.player.stats.intelligence += 2;
            if (selectedMajor === 'arts') gameState.player.stats.creativity += 2;
            if (selectedMajor === 'business') gameState.player.stats.charisma += 2;
            if (selectedMajor === 'science') {
                gameState.player.stats.intelligence += 1;
                gameState.player.stats.creativity += 1;
            }

            // Hide creation, show game
            document.getElementById('characterCreation').style.display = 'none';
            document.getElementById('topHud').style.display = 'flex';
            document.getElementById('gameContainer').classList.add('active');
            
            // Update HUD
            updateHUD();
            renderRelationships();
            
            // Start game systems
            startTimeSystem();
            startRandomEvents();
            
            showToast(`Welcome to Campus Life, ${name}! 🎉`, 'success');
            
            // Trigger welcome event
            setTimeout(() => showEvent('welcome'), 1000);
        }

        // HUD Updates
        function updateHUD() {
            document.getElementById('hudAvatar').textContent = gameState.player.avatar;
            document.getElementById('hudName').textContent = gameState.player.name;
            document.getElementById('hudLevel').textContent = gameState.player.level;
            document.getElementById('hudMajor').textContent = selectedMajor.charAt(0).toUpperCase() + selectedMajor.slice(1);
            document.getElementById('moneyDisplay').textContent = `$${gameState.player.money}`;
            
            // Update bars
            document.getElementById('energyBar').style.width = `${gameState.player.energy}%`;
            document.getElementById('happinessBar').style.width = `${gameState.player.happiness}%`;
            document.getElementById('gpaBar').style.width = `${(gameState.player.gpa / 4) * 100}%`;
            
            // Update time
            updateTimeDisplay();
        }

        function updateTimeDisplay() {
            const timeStr = `Day ${gameState.time.day} • ${String(gameState.time.hour).padStart(2, '0')}:${String(gameState.time.minute).padStart(2, '0')}`;
            document.getElementById('timeDisplay').innerHTML = `<i class="fas fa-clock"></i><span>${timeStr}</span>`;
        }

        // Time System
        function startTimeSystem() {
            setInterval(() => {
                gameState.time.minute += 10;
                if (gameState.time.minute >= 60) {
                    gameState.time.minute = 0;
                    gameState.time.hour++;
                    
                    // Energy drain
                    gameState.player.energy = Math.max(0, gameState.player.energy - 2);
                    
                    if (gameState.time.hour >= 24) {
                        gameState.time.hour = 0;
                        gameState.time.day++;
                        gameState.player.energy = Math.min(100, gameState.player.energy + 50); // Sleep restore
                        showToast(`Day ${gameState.time.day} begins! Good morning! ☀️`, 'success');
                    }
                    
                    // Day/night cycle
                    updateDayNightCycle();
                }
                updateTimeDisplay();
                updateHUD();
            }, 2000); // 2 seconds = 10 minutes game time
        }

        function updateDayNightCycle() {
            const hour = gameState.time.hour;
            const body = document.body;
            
            if (hour >= 20 || hour < 6) {
                body.classList.add('night-mode');
            } else {
                body.classList.remove('night-mode');
            }
        }

        // Weather System
        function changeWeather(weather) {
            const overlay = document.getElementById('weatherOverlay');
            overlay.className = 'weather-overlay';
            document.body.classList.remove('rainy');
            
            if (weather === 'rain') {
                overlay.classList.add('active', 'rain');
                document.body.classList.add('rainy');
                showToast('It started raining! ☔ Study focus increased!', 'success');
            } else if (weather === 'snow') {
                overlay.classList.add('active', 'snow');
                showToast('Snow is falling! ❄️ Campus looks beautiful!', 'success');
            }
        }

        // Location & Activities
        function travelTo(location) {
            if (gameState.player.energy < 10) {
                showToast('Too tired! Rest at the park or dorm! 😴', 'warning');
                return;
            }
            
            gameState.currentLocation = location;
            document.querySelectorAll('.location-node').forEach(n => n.classList.remove('active'));
            document.getElementById(`loc-${location}`).classList.add('active');
            
            const locationNames = {
                'library': 'Library',
                'cafe': 'Café',
                'gym': 'Gym',
                'studio': 'Art Studio',
                'hall': 'Student Hall',
                'park': 'Campus Park'
            };
            
            document.getElementById('currentLocation').textContent = locationNames[location];
            gameState.player.energy -= 5;
            updateHUD();
            
            // Start activity based on location
            startActivity(location);
        }

        function startActivity(location) {
            const activities = {
                'library': { name: 'Studying...', xp: 20, skill: 'academics', stat: 'intelligence', duration: 30 },
                'cafe': { name: 'Socializing...', xp: 15, skill: 'social', stat: 'charisma', duration: 20 },
                'gym': { name: 'Working Out...', xp: 18, skill: 'athletics', stat: 'fitness', duration: 25 },
                'studio': { name: 'Creating Art...', xp: 22, skill: 'arts', stat: 'creativity', duration: 35 },
                'hall': { name: 'Attending Event...', xp: 16, skill: 'social', stat: 'charisma', duration: 25 },
                'park': { name: 'Relaxing...', xp: 10, skill: 'social', stat: 'charisma', duration: 15, energyRestore: 20 }
            };
            
            const activity = activities[location];
            gameState.currentActivity = activity;
            gameState.activityProgress = 0;
            
            document.getElementById('activityPanel').style.display = 'block';
            document.getElementById('activityTitle').textContent = activity.name;
            document.getElementById('xpReward').textContent = activity.xp;
            document.getElementById('skillReward').textContent = Math.floor(activity.xp / 10);
            
            // Animate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 100 / (activity.duration / 2); // Update every 2 seconds
                gameState.activityProgress = progress;
                document.getElementById('activityBar').style.width = `${progress}%`;
                
                // Update timer
                const remaining = Math.ceil(activity.duration * (1 - progress/100));
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;
                document.getElementById('activityTimer').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    completeActivity(activity);
                }
            }, 2000);
            
            gameState.activityInterval = interval;
        }

        function completeActivity(activity) {
            // Rewards
            addXP(activity.xp);
            gameState.player.skills[activity.skill] += Math.floor(activity.xp / 5);
            gameState.player.stats[activity.stat] += Math.floor(activity.xp / 20);
            
            if (activity.energyRestore) {
                gameState.player.energy = Math.min(100, gameState.player.energy + activity.energyRestore);
            }
            
            // Update skill bars
            document.getElementById(`skill-${activity.skill}`).style.width = `${Math.min(100, gameState.player.skills[activity.skill])}%`;
            
            document.getElementById('activityPanel').style.display = 'none';
            showToast(`Activity complete! +${activity.xp} XP! ✨`, 'success');
            
            // Random chance for event
            if (Math.random() < 0.3) {
                setTimeout(() => triggerRandomEvent(), 1000);
            }
        }

        function cancelActivity() {
            if (gameState.activityInterval) {
                clearInterval(gameState.activityInterval);
                document.getElementById('activityPanel').style.display = 'none';
                showToast('Activity cancelled.', 'warning');
            }
        }

        // XP & Leveling
        function addXP(amount) {
            gameState.player.xp += amount;
            
            // Create floating text
            createFloatingText(`+${amount} XP`, event.clientX || window.innerWidth/2, event.clientY || window.innerHeight/2);
            
            if (gameState.player.xp >= gameState.player.xpToNext) {
                levelUp();
            }
            updateHUD();
        }

        function levelUp() {
            gameState.player.level++;
            gameState.player.xp -= gameState.player.xpToNext;
            gameState.player.xpToNext = Math.floor(gameState.player.xpToNext * 1.5);
            
            // Show level up overlay
            const overlay = document.getElementById('levelupOverlay');
            document.getElementById('levelupText').textContent = `You reached Level ${gameState.player.level}!`;
            overlay.classList.add('show');
            
            // Create confetti
            for (let i = 0; i < 20; i++) {
                setTimeout(() => createConfetti(), i * 100);
            }
            
            setTimeout(() => {
                overlay.classList.remove('show');
            }, 3000);
            
            showToast(`Level Up! You're now level ${gameState.player.level}! 🎉`, 'success');
        }

        function createFloatingText(text, x, y) {
            const el = document.createElement('div');
            el.className = 'particle';
            el.textContent = text;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.color = '#f1c40f';
            el.style.fontWeight = 'bold';
            el.style.fontSize = '1.5rem';
            el.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
            document.body.appendChild(el);
            
            setTimeout(() => el.classList.add('show'), 10);
            setTimeout(() => el.remove(), 2000);
        }

        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = ['#ff6b9d', '#c44569', '#a29bfe', '#f1c40f'][Math.floor(Math.random() * 4)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.getElementById('levelupOverlay').appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }

        // Relationships
        function renderRelationships() {
            const list = document.getElementById('relationshipsList');
            list.innerHTML = '';
            
            gameState.relationships.forEach(rel => {
                const card = document.createElement('div');
                card.className = 'relationship-card';
                card.onclick = () => interactWith(rel);
                card.innerHTML = `
                    <div class="rel-avatar">
                        ${rel.avatar}
                        <div class="rel-status"></div>
                    </div>
                    <div class="rel-info">
                        <div class="rel-name">${rel.name}</div>
                        <div class="rel-level">${rel.status} • Lv.${rel.level}</div>
                    </div>
                    <div class="hearts">${rel.hearts}</div>
                `;
                list.appendChild(card);
            });
        }

        function interactWith(relationship) {
            showEvent('interaction', relationship);
        }

        // Event System
        function startRandomEvents() {
            setInterval(() => {
                if (Math.random() < 0.2) { // 20% chance every interval
                    triggerRandomEvent();
                }
            }, 30000); // Check every 30 seconds
        }

        function triggerRandomEvent() {
            const events = [
                {
                    icon: '📢',
                    title: 'Pop Quiz!',
                    desc: 'Professor Johnson just announced a surprise quiz! Do you want to use your energy to study quickly?',
                    choices: [
                        { text: 'Study (Energy -20)', action: () => { gameState.player.energy -= 20; addXP(30); showToast('You aced the quiz! +30 XP', 'success'); } },
                        { text: 'Skip (-GPA)', action: () => { gameState.player.gpa -= 0.1; showToast('GPA dropped slightly...', 'warning'); } }
                    ]
                },
                {
                    icon: '🎁',
                    title: 'Found Money!',
                    desc: 'You found $50 on the ground! Lucky day!',
                    choices: [
                        { text: 'Keep it', action: () => { gameState.player.money += 50; updateHUD(); showToast('+$50! 💰', 'success'); } },
                        { text: 'Donate to charity', action: () => { gameState.player.happiness += 10; showToast('Feel good bonus! Happiness +10', 'success'); } }
                    ]
                },
                {
                    icon: '💌',
                    title: 'Party Invitation',
                    desc: 'Sarah invited you to a dorm party tonight! It might be fun but will cost energy.',
                    choices: [
                        { text: 'Attend (Energy -30)', action: () => { gameState.player.energy -= 30; gameState.player.happiness += 15; addXP(20); showToast('Great party! +20 XP, Happiness +15', 'success'); } },
                        { text: 'Decline', action: () => { showToast('Maybe next time...', 'warning'); } }
                    ]
                }
            ];
            
            const event = events[Math.floor(Math.random() * events.length)];
            showEvent('random', event);
        }

        function showEvent(type, data) {
            const popup = document.getElementById('eventPopup');
            const icon = document.getElementById('eventIcon');
            const title = document.getElementById('eventTitle');
            const desc = document.getElementById('eventDesc');
            const choices = document.getElementById('eventChoices');
            
            if (type === 'welcome') {
                icon.textContent = '🎓';
                title.textContent = 'Welcome to Campus!';
                desc.textContent = 'Your college journey begins today! Attend classes, make friends, join clubs, and build your future. Check the quests panel to get started!';
                choices.innerHTML = '<button class="choice-btn" onclick="closeEvent()">Let\'s go!</button>';
            } else if (type === 'random') {
                icon.textContent = data.icon;
                title.textContent = data.title;
                desc.textContent = data.desc;
                choices.innerHTML = data.choices.map((c, i) => 
                    `<button class="choice-btn" onclick="handleEventChoice(${i})">${c.text}</button>`
                ).join('');
                popup.currentEvent = data;
            } else if (type === 'interaction') {
                icon.textContent = data.avatar;
                title.textContent = `Talk to ${data.name}`;
                desc.textContent = `${data.name} is ${data.status.toLowerCase()} with you. What would you like to do?`;
                choices.innerHTML = `
                    <button class="choice-btn" onclick="improveRelationship('${data.name}', 1)">Chat (+Friendship)</button>
                    <button class="choice-btn" onclick="closeEvent()">Say goodbye</button>
                `;
            }
            
            popup.classList.add('show');
        }

        function handleEventChoice(index) {
            const event = document.getElementById('eventPopup').currentEvent;
            if (event && event.choices[index]) {
                event.choices[index].action();
            }
            closeEvent();
        }

        function improveRelationship(name, amount) {
            const rel = gameState.relationships.find(r => r.name === name);
            if (rel) {
                rel.level += amount;
                if (rel.level > 3) rel.level = 3;
                rel.hearts = '❤️'.repeat(rel.level) + '🤍'.repeat(3 - rel.level);
                if (rel.level === 2) rel.status = 'Good Friend';
                if (rel.level === 3) rel.status = 'Best Friend';
                renderRelationships();
                showToast(`Relationship with ${name} improved! ❤️`, 'success');
            }
            closeEvent();
        }

        function closeEvent() {
            document.getElementById('eventPopup').classList.remove('show');
        }

        // Chat System
        function switchTab(tab, btn) {
            document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        }

        function toggleEmojiPicker() {
            document.getElementById('emojiPicker').classList.toggle('show');
        }

        function addEmoji(emoji) {
            const input = document.getElementById('chatInput');
            input.value += emoji;
            input.focus();
            toggleEmojiPicker();
        }

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const text = input.value.trim();
            if (!text) return;
            
            const chatMessages = document.getElementById('chatMessages');
            const msg = document.createElement('div');
            msg.className = 'message own';
            msg.innerHTML = `<div>${text}</div>`;
            chatMessages.appendChild(msg);
            
            input.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            document.getElementById('emojiPicker').classList.remove('show');
            
            // Simulate reply
            setTimeout(() => simulateReply(), 2000 + Math.random() * 3000);
        }

        function simulateReply() {
            const replies = [
                { sender: 'Emma 🌸', text: 'That sounds fun! Count me in! ✨' },
                { sender: 'Lucas 🎮', text: 'Anyone up for a gaming session later?' },
                { sender: 'Sophie 📸', text: 'The sunset at the park is gorgeous right now! 🌅' },
                { sender: 'Jake 🏀', text: 'Good luck on your exams everyone! 📚💪' }
            ];
            
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const chatMessages = document.getElementById('chatMessages');
            const msg = document.createElement('div');
            msg.className = 'message other';
            msg.innerHTML = `<div class="message-sender">${reply.sender}</div><div>${reply.text}</div>`;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') sendMessage();
        }

        // Quest System
        function startQuest(type) {
            showToast(`Quest started: ${type}! Check your progress. 🎯`, 'success');
        }

        // Utility
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast ' + type;
            toast.classList.add('show');
            
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function showProfile() {
            showToast('Profile feature coming soon! 👤', 'info');
        }

        function showSettings() {
            showToast('Settings feature coming soon! ⚙️', 'info');
        }

        function showNotifications() {
            document.getElementById('notifBadge').style.display = 'none';
            showToast('No new notifications! 📭', 'info');
        }

        // Close emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            const picker = document.getElementById('emojiPicker');
            const emojiBtn = document.querySelector('.emoji-btn');
            if (!picker.contains(e.target) && !emojiBtn.contains(e.target)) {
                picker.classList.remove('show');
            }
        });

        // Random weather changes
        setInterval(() => {
            if (Math.random() < 0.1) {
                const weathers = ['clear', 'rain', 'snow'];
                const weather = weathers[Math.floor(Math.random() * weathers.length)];
                if (weather !== 'clear') changeWeather(weather);
                else {
                    document.getElementById('weatherOverlay').className = 'weather-overlay';
                    document.body.classList.remove('rainy');
                }
            }
        }, 60000); // Check every minute
    </script>
</body>
</html>
