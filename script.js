// ゲームの状態管理
let gameState = {
    money: 1000,
    day: 1,
    trust: 50,
    inventory: [],
    shopItems: [],
    dailyCosts: 0,
    dailyIncome: 0,
    customerCount: 0,
    displayMode: 'normal',
    currentPhase: 'buy'
};

// 商品データベース
const itemDatabase = [
    { id: 1, name: 'あまーいチョコ', icon: '🍫', basePrice: 80, category: 'food' },
    { id: 2, name: 'おもちゃの車', icon: '🚗', basePrice: 500, category: 'toy' },
    { id: 3, name: '光る石', icon: '💎', basePrice: 300, category: 'gem' },
    { id: 4, name: '宇宙の地図', icon: '🗺️', basePrice: 150, category: 'book' },
    { id: 5, name: 'ロボットの手', icon: '🤖', basePrice: 400, category: 'tech' },
    { id: 6, name: '魔法の杖', icon: '🪄', basePrice: 600, category: 'magic' }
];

// 売り手データベース
const sellerDatabase = [
    { name: '宇宙商人ゼータ', icon: '👽', story: '故郷の星で見つけた古い部品です。現金が必要で...' },
    { name: 'ロボット商人R2', icon: '🤖', story: '工場で余った材料です。安く譲りますよ！' },
    { name: '魔法使いウィザード', icon: '🧙‍♂️', story: '冒険で手に入れた宝物です。どうでしょう？' },
    { name: 'かわいい妖精', icon: '🧚‍♀️', story: '森で拾った綺麗なものです。気に入ってくれるかな？' }
];

// お客様データベース
const customerDatabase = [
    { 
        name: 'おしゃれ中学生', 
        icon: '👦', 
        image: './images/customer1.png', // 添付画像用のパス
        need: 'かわいいものとか、美味しいものが欲しいです。', 
        budget: 400,
        preferences: ['food', 'toy']
    },
    { 
        name: 'AI修理技師ロボ', 
        icon: '🤖', 
        image: './images/customer2.png',
        need: 'AIの部品を探しています。', 
        budget: 300,
        preferences: ['tech']
    },
    { 
        name: '宇宙探検家', 
        icon: '👨‍🚀', 
        image: './images/customer3.png',
        need: '宇宙旅行に役立つものを探しています。', 
        budget: 800,
        preferences: ['tech', 'book']
    },
    { 
        name: '魔法学校の生徒', 
        icon: '🧙‍♀️', 
        image: './images/customer4.png',
        need: '魔法の勉強に使えるものはありますか？', 
        budget: 600,
        preferences: ['magic', 'gem']
    }
];

// 現在のオファーと顧客
let currentOffer = null;
let currentCustomer = null;

// ゲーム開始時の初期化
function initGame() {
    updateDisplay();
    generateOffer();
    showPhase('buy');
}

// 表示更新
function updateDisplay() {
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('trust').textContent = gameState.trust;
}

// オファー生成
function generateOffer() {
    const randomItem = itemDatabase[Math.floor(Math.random() * itemDatabase.length)];
    const randomSeller = sellerDatabase[Math.floor(Math.random() * sellerDatabase.length)];
    const price = Math.floor(randomItem.basePrice * (0.5 + Math.random() * 0.5));
    
    currentOffer = {
        ...randomItem,
        seller: randomSeller,
        offerPrice: price,
        buyPrice: price
    };
    
    document.getElementById('seller-name').textContent = randomSeller.name;
    document.getElementById('seller-story').textContent = randomSeller.story;
    document.querySelector('.seller-portrait').textContent = randomSeller.icon;
    
    document.getElementById('offer-icon').textContent = randomItem.icon;
    document.getElementById('offer-name').textContent = randomItem.name;
    document.getElementById('offer-description').textContent = `${randomItem.name}です。カテゴリ: ${randomItem.category}`;
    document.getElementById('offer-price').textContent = price;
}

// 交渉処理
function negotiate(type) {
    if (!currentOffer) return;
    
    let finalPrice = currentOffer.offerPrice;
    let trustChange = 0;
    let message = '';
    
    switch(type) {
        case 'kind':
            finalPrice = currentOffer.offerPrice;
            trustChange = 2;
            message = '😊 親切な対応で信頼度が上がりました！';
            break;
        case 'neutral':
            finalPrice = Math.floor(currentOffer.offerPrice * 0.9);
            trustChange = 0;
            message = '🤝 普通の交渉が成立しました';
            break;
        case 'strict':
            finalPrice = Math.floor(currentOffer.offerPrice * 0.7);
            trustChange = -1;
            message = '💼 厳しい交渉で安く買えましたが、信頼度が少し下がりました';
            break;
    }
    
    if (gameState.money >= finalPrice) {
        gameState.money -= finalPrice;
        gameState.dailyCosts += finalPrice;
        gameState.trust += trustChange;
        
        // 在庫に追加
        const purchasedItem = {
            ...currentOffer,
            buyPrice: finalPrice,
            sellPrice: Math.floor(finalPrice * 1.5) // デフォルト販売価格
        };
        gameState.inventory.push(purchasedItem);
        
        showMessage(message);
        updateDisplay();
        generateOffer(); // 新しいオファー生成
    } else {
        showMessage('💸 お金が足りません！');
    }
}

// 購入スキップ
function skipBuy() {
    showMessage('❌ 今回の商品はパスしました');
    generateOffer();
}

// メッセージ表示
function showMessage(text) {
    const messageEl = document.getElementById('message-display');
    messageEl.textContent = text;
    messageEl.style.display = 'block';
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// フェーズ表示切り替え
function showPhase(phase) {
    // すべてのフェーズを非表示
    document.querySelectorAll('.phase-container').forEach(el => {
        el.classList.remove('active');
    });
    
    // 指定されたフェーズを表示
    document.getElementById(phase + '-phase').classList.add('active');
    gameState.currentPhase = phase;
    
    if (phase === 'display') {
        updateInventoryDisplay();
    } else if (phase === 'sell') {
        generateCustomer();
        updateShopDisplay();
    }
}

// 陳列フェーズへ移動
function goToDisplayPhase() {
    if (gameState.inventory.length === 0) {
        showMessage('📦 商品を仕入れてから陳列してください！');
        return;
    }
    showPhase('display');
}

// 在庫表示更新
function updateInventoryDisplay() {
    const inventoryEl = document.getElementById('inventory');
    inventoryEl.innerHTML = '';
    
    gameState.inventory.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="price">仕入: ${item.buyPrice}円</div>
        `;
        itemEl.onclick = () => toggleShopItem(index);
        inventoryEl.appendChild(itemEl);
    });
}

// 陳列モード設定
function setDisplayMode(mode) {
    gameState.displayMode = mode;
    
    // ボタンのアクティブ状態更新
    document.querySelectorAll('.display-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('display-' + mode).classList.add('active');
    
    // カスタム価格設定の表示/非表示
    const priceSection = document.getElementById('price-setting-section');
    if (mode === 'custom') {
        priceSection.style.display = 'block';
        updatePriceSettingItems();
    } else {
        priceSection.style.display = 'none';
        // 自動価格設定
        gameState.inventory.forEach(item => {
            switch(mode) {
                case 'normal':
                    item.sellPrice = Math.floor(item.buyPrice * 1.5);
                    break;
                case 'theme':
                    item.sellPrice = Math.floor(item.buyPrice * 1.8);
                    break;
                case 'sale':
                    item.sellPrice = Math.floor(item.buyPrice * 1.2);
                    break;
                case 'premium':
                    item.sellPrice = Math.floor(item.buyPrice * 2.0);
                    break;
            }
        });
    }
    
    updateInventoryDisplay();
    
    let modeMessage = '';
    switch(mode) {
        case 'normal': modeMessage = '📦 普通陳列: 標準的な価格設定'; break;
        case 'theme': modeMessage = '🎨 テーマ展示: 見た目重視で高めの価格'; break;
        case 'sale': modeMessage = '💰 安売りコーナー: お手頃価格で薄利多売'; break;
        case 'premium': modeMessage = '✨ プレミアム棚: 高級感で高価格'; break;
        case 'custom': modeMessage = '🏷️ カスタム価格: 自由に価格設定'; break;
    }
    showMessage(modeMessage);
}

// 価格設定アイテム更新
function updatePriceSettingItems() {
    const container = document.getElementById('price-setting-items');
    container.innerHTML = '';
    
    gameState.inventory.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'price-item';
        itemEl.innerHTML = `
            <div class="price-item-header">
                <span class="price-item-icon">${item.icon}</span>
                <span class="price-item-name">${item.name}</span>
            </div>
            <div class="price-item-info">仕入価格: ${item.buyPrice}円</div>
            <div class="price-input-area">
                <input type="number" value="${item.sellPrice}" min="${item.buyPrice}" 
                       onchange="updateItemPrice(${index}, this.value)">
                <span>円</span>
                <button class="price-preset-btn" onclick="setPresetPrice(${index}, 1.2)">安売り</button>
                <button class="price-preset-btn" onclick="setPresetPrice(${index}, 1.5)">標準</button>
                <button class="price-preset-btn" onclick="setPresetPrice(${index}, 2.0)">高級</button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

// アイテム価格更新
function updateItemPrice(index, price) {
    const numPrice = parseInt(price);
    if (numPrice >= gameState.inventory[index].buyPrice) {
        gameState.inventory[index].sellPrice = numPrice;
    }
}

// プリセット価格設定
function setPresetPrice(index, multiplier) {
    const newPrice = Math.floor(gameState.inventory[index].buyPrice * multiplier);
    gameState.inventory[index].sellPrice = newPrice;
    updatePriceSettingItems();
}

// 販売開始
function startSelling() {
    // 全在庫を店頭商品に移動
    gameState.shopItems = [...gameState.inventory];
    gameState.inventory = [];
    showPhase('sell');
}

// 顧客生成
function generateCustomer() {
    currentCustomer = customerDatabase[Math.floor(Math.random() * customerDatabase.length)];
    
    document.getElementById('customer-name').textContent = currentCustomer.name;
    document.getElementById('customer-need').textContent = `${currentCustomer.need} 予算は${currentCustomer.budget}円です。`;
    
    // お客様のアイコン表示（画像が利用可能な場合は画像、そうでなければ絵文字）
    const customerPortrait = document.querySelector('.customer-portrait');
    
    // 画像の存在確認と表示
    const img = new Image();
    img.onload = function() {
        customerPortrait.innerHTML = `<img src="${currentCustomer.image}" alt="${currentCustomer.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    };
    img.onerror = function() {
        // 画像が読み込めない場合は絵文字を表示
        customerPortrait.textContent = currentCustomer.icon;
    };
    img.src = currentCustomer.image;
}

// 店頭商品表示更新
function updateShopDisplay() {
    const shopEl = document.getElementById('shop-items');
    shopEl.innerHTML = '';
    
    gameState.shopItems.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'shop-item';
        itemEl.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="price">${item.sellPrice}円</div>
        `;
        shopEl.appendChild(itemEl);
    });
}

// 顧客の購入判定
function customerBuy() {
    if (!currentCustomer || gameState.shopItems.length === 0) {
        showMessage('🛍️ 商品がありません');
        return;
    }
    
    // 顧客の好みと予算に合った商品を探す
    const affordableItems = gameState.shopItems.filter(item => 
        item.sellPrice <= currentCustomer.budget
    );
    
    const preferredItems = affordableItems.filter(item =>
        currentCustomer.preferences.includes(item.category)
    );
    
    // 購入判定
    const itemsToBuy = preferredItems.length > 0 ? preferredItems : affordableItems;
    
    if (itemsToBuy.length > 0) {
        // ランダムに商品を選択
        const boughtItem = itemsToBuy[Math.floor(Math.random() * itemsToBuy.length)];
        
        // 陳列方式によるボーナス計算
        let finalPrice = boughtItem.sellPrice;
        let trustBonus = 0;
        
        switch(gameState.displayMode) {
            case 'theme':
                if (preferredItems.includes(boughtItem)) {
                    finalPrice = Math.floor(finalPrice * 1.1);
                    trustBonus = 1;
                }
                break;
            case 'sale':
                trustBonus = 1;
                break;
            case 'premium':
                if (currentCustomer.budget >= finalPrice * 1.2) {
                    finalPrice = Math.floor(finalPrice * 1.1);
                    trustBonus = 2;
                }
                break;
        }
        
        // 購入処理
        gameState.money += finalPrice;
        gameState.dailyIncome += finalPrice;
        gameState.trust += trustBonus;
        gameState.customerCount++;
        
        // 商品を店頭から削除
        const itemIndex = gameState.shopItems.indexOf(boughtItem);
        gameState.shopItems.splice(itemIndex, 1);
        
        showMessage(`💰 ${boughtItem.name}が${finalPrice}円で売れました！`);
        updateDisplay();
        updateShopDisplay();
    } else {
        showMessage('😔 お客様の予算に合う商品がありませんでした');
    }
}

// 次の顧客
function nextCustomer() {
    generateCustomer();
    showMessage('👋 新しいお客様がいらっしゃいました');
}

// 販売終了
function endSelling() {
    showPhase('result');
    updateResults();
}

// 結果更新
function updateResults() {
    const profit = gameState.dailyIncome - gameState.dailyCosts;
    
    document.getElementById('buy-cost').textContent = gameState.dailyCosts;
    document.getElementById('sell-income').textContent = gameState.dailyIncome;
    document.getElementById('daily-profit').textContent = profit;
    document.getElementById('customer-count').textContent = gameState.customerCount;
    
    // 市場ニュース生成
    const news = [
        '宇宙旅行ブームが到来！宇宙船関連商品が人気になりそうです。',
        'ロボット技術の進歩で、AI関連商品の需要が高まっています。',
        '魔法学校の新学期で、魔法用品が売れ筋になっています。',
        '子供たちの間でおもちゃブーム！可愛い商品が注目されています。'
    ];
    document.getElementById('market-news').textContent = news[Math.floor(Math.random() * news.length)];
}

// 次の日へ
function nextDay() {
    gameState.day++;
    gameState.dailyCosts = 0;
    gameState.dailyIncome = 0;
    gameState.customerCount = 0;
    gameState.shopItems = [];
    
    updateDisplay();
    generateOffer();
    showPhase('buy');
    showMessage(`🌅 Day ${gameState.day}が始まりました！`);
}

// 画面回転の推奨メッセージ
function checkOrientation() {
    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
        showMessage('📱 スマホを横向きにするとより遊びやすくなります！');
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    checkOrientation();
    
    // 画面回転時の処理
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 100);
    });
    
    // リサイズ時の処理
    window.addEventListener('resize', checkOrientation);
});

// 在庫アイテムをクリックした際の処理（将来の拡張用）
function toggleShopItem(index) {
    // 現在は特に何もしませんが、将来的に個別商品管理機能を追加可能
    showMessage(`📦 "${gameState.inventory[index].name}"を確認しました`);
}
