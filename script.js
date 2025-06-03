// ゲームの現在の状態を保存する変数
let gameState = {
    money: 1000,
    day: 1,
    trust: 50,
    inventory: [],
    shopItems: [],
    displayMode: 'normal',
    dailyBuyCost: 0,
    dailySellIncome: 0,
    currentOffer: null,
    currentCustomer: null,
    customerCount: 0 // その日の来店客数
};

// 商品データ
const items = [
    { id: 'apple', name: 'りんご', icon: '🍎', basePrice: 100, popularity: 70, type: 'food', description: '新鮮でおいしいりんご' },
    { id: 'bread', name: 'ふわふわパン', icon: '🍞', basePrice: 150, popularity: 80, type: 'food', description: 'ふわふわで美味しいパン' },
    { id: 'toy_car', name: 'おもちゃの車', icon: '🚗', basePrice: 500, popularity: 60, type: 'toy', description: '楽しいおもちゃの車' },
    { id: 'juice', name: 'フレッシュジュース', icon: '🧃', basePrice: 120, popularity: 75, type: 'drink', description: '新鮮なフルーツジュース' },
    { id: 'book', name: 'ふしぎな本', icon: '📚', basePrice: 300, popularity: 50, type: 'misc', description: '読むと楽しい本' },
    { id: 'flower', name: 'きれいな花', icon: '🌸', basePrice: 200, popularity: 65, type: 'misc', description: 'とても綺麗な花' },
    { id: 'chocolate', name: 'あまーいチョコ', icon: '🍫', basePrice: 80, popularity: 90, type: 'food', description: 'とても甘くて美味しいチョコレート' },
    { id: 'hat', name: 'おしゃれな帽子', icon: '👒', basePrice: 250, popularity: 40, type: 'fashion', description: 'とてもおしゃれな帽子' },
    { id: 'cake', name: 'バースデーケーキ', icon: '🎂', basePrice: 350, popularity: 95, type: 'food', description: '特別な日のケーキ' },
    { id: 'ball', name: '元気が出るボール', icon: '⚽', basePrice: 90, popularity: 80, type: 'toy', description: '遊ぶのが楽しいボール' }
];

// お客さんデータ（画像対応版）
const customers = [
    { 
        id: 'kid', 
        name: '元気な子ども', 
        icon: '👦', 
        image: 'images/customer1.png',
        budget: 300, 
        likedItems: ['toy_car', 'chocolate', 'ball', 'cake'], 
        need: 'おもちゃか甘いものが欲しいな。予算は300円！' 
    },
    { 
        id: 'adult', 
        name: 'お父さん', 
        icon: '👨', 
        image: 'images/customer2.png',
        budget: 800, 
        likedItems: ['bread', 'book', 'apple'], 
        need: '日用品や食料品を探しています。予算は800円。' 
    },
    { 
        id: 'student', 
        name: 'がんばる学生', 
        icon: '👩‍🎓', 
        image: 'images/customer3.png',
        budget: 250, 
        likedItems: ['juice', 'chocolate', 'book'], 
        need: '手軽に買える飲み物かおやつ、本があれば嬉しいな。予算は250円。' 
    },
    { 
        id: 'grandma', 
        name: 'やさしいおばあさん', 
        icon: '👵', 
        image: 'images/customer4.png',
        budget: 600, 
        likedItems: ['flower', 'cake', 'apple'], 
        need: 'きれいなものや美味しいものがいいわね。予算は600円くらい。' 
    },
    { 
        id: 'office', 
        name: 'いそがし会社員', 
        icon: '👔', 
        image: 'images/customer5.png',
        budget: 500, 
        likedItems: ['bread', 'juice', 'book'], 
        need: '仕事の合間にちょっと一息つけるものが欲しい。予算は500円。' 
    },
    { 
        id: 'family', 
        name: 'にぎやか家族', 
        icon: '👪', 
        image: 'images/customer6.png',
        budget: 1000, 
        likedItems: ['toy_car', 'juice', 'bread', 'cake'], 
        need: '家族みんなで楽しめるものを探しています！予算は1000円まで。' 
    },
    { 
        id: 'teen', 
        name: 'おしゃれ中学生', 
        icon: '👧', 
        image: 'images/customer7.png',
        budget: 400, 
        likedItems: ['hat', 'chocolate', 'juice'], 
        need: 'かわいいものとか、美味しいものが欲しいです。予算は400円。' 
    },
    { 
        id: 'chef', 
        name: 'コック長', 
        icon: '👨‍🍳', 
        image: 'images/customer8.png',
        budget: 700, 
        likedItems: ['apple', 'bread', 'cake'], 
        need: '料理に使える新鮮な食材を探しています。予算は700円。' 
    },
    { 
        id: 'artist', 
        name: 'アーティスト', 
        icon: '👩‍🎨', 
        image: 'images/customer9.png',
        budget: 600, 
        likedItems: ['flower', 'book', ''], 
        need: 'インスピレーションを得られるものが欲しいです。予算は600円。' 
    },
    { 
        id: 'scientist', 
        name: '博士', 
        icon: '👨‍🔬', 
        image: 'images/customer10.png',
        budget: 900, 
        likedItems: ['book', 'apple', 'juice'], 
        need: '研究の合間に楽しめるものを探しています。予算は900円。' 
    }
];

// 流行データ（例：特定の日付に特定のアイテムタイプが流行る）
const trends = [
    { day: 3, name: '宇宙旅行ブーム', boostItemType: 'toy', boostAmount: 1.5, news: '宇宙旅行ブームが到来！宇宙船関連商品が人気になりそうです。' },
    { day: 5, name: '健康志向の高まり', boostItemType: 'food', boostAmount: 1.3, news: '健康への意識が高まっています！新鮮な食材が売れるかも？' },
    { day: 7, name: '読書週間', boostItemType: 'misc', boostAmount: 1.8, news: '今年の読書週間に合わせて、本が注目されています！' }
];

// ランダムな商品を取得
function getRandomItem() {
    return items[Math.floor(Math.random() * items.length)];
}

// ランダムなお客さんを取得
function getRandomCustomer() {
    return customers[Math.floor(Math.random() * customers.length)];
}

// メッセージを表示
function showMessage(message) {
    const messageDiv = document.getElementById('message-display');
    if (messageDiv) { // null check
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// フェーズを切り替える
function showPhase(phaseId) {
    document.querySelectorAll('.phase-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(phaseId).classList.add('active');
}

// 画面表示を更新
function updateUI() {
    document.getElementById('money').textContent = gameState.money;
    document.getElementById('day').textContent = gameState.day;
    document.getElementById('trust').textContent = gameState.trust;
    
    updateInventoryDisplay();
    updateShopDisplay(); // 店頭商品表示を更新
}

// 在庫表示を更新
function updateInventoryDisplay() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    
    if (gameState.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p style="color: #ccc; text-align: center;">在庫がありません。</p>';
    }
    
    gameState.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.onclick = () => moveToShop(index);
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="price">${item.basePrice}円</div>
        `;
        inventoryDiv.appendChild(itemDiv);
    });
}

// 店頭商品表示を更新
function updateShopDisplay() {
    const shopDiv = document.getElementById('shop-items');
    shopDiv.innerHTML = '';
    
    if (gameState.shopItems.length === 0) {
        shopDiv.innerHTML = '<p style="color: #ccc; text-align: center;">店頭に商品がありません。</p>';
    }

    gameState.shopItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="price">${getItemPrice(item)}円</div>
        `;
        shopDiv.appendChild(itemDiv);
    });
}

// 陳列方法による価格計算
function getItemPrice(item) {
    let price = item.basePrice;
    switch (gameState.displayMode) {
        case 'theme': // テーマ展示: 少し高く売れる
            price = Math.round(price * 1.3);
            break;
        case 'sale': // 安売りコーナー: 安く売るが回転率アップ
            price = Math.round(price * 0.8);
            break;
        case 'premium': // プレミアム棚: かなり高く売れるが売れにくい
            price = Math.round(price * 1.5);
            break;
        default: // 普通陳列
            break;
    }
    return price;
}

// 新しい仕入れオファーを生成
function generateNewOffer() {
    gameState.currentOffer = getRandomItem();
    document.getElementById('offer-icon').textContent = gameState.currentOffer.icon;
    document.getElementById('offer-name').textContent = gameState.currentOffer.name;
    document.getElementById('offer-description').textContent = gameState.currentOffer.description;
    document.getElementById('offer-price').textContent = gameState.currentOffer.basePrice;
}

// 仕入れ交渉
function negotiate(type) {
    if (!gameState.currentOffer) {
        showMessage('仕入れる商品がありません。');
        return;
    }
    
    let finalPrice = gameState.currentOffer.basePrice;
    let message = '';
    
    switch (type) {
        case 'kind':
            gameState.trust = Math.min(100, gameState.trust + 10);
            message = '親切に対応したので信頼度が10上がりました！';
            break;
        case 'neutral':
            finalPrice = Math.round(finalPrice * 0.9);
            message = '普通に交渉して10%安くなりました！';
            break;
        case 'strict':
            finalPrice = Math.round(finalPrice * 0.7);
            gameState.trust = Math.max(0, gameState.trust - 5);
            message = '厳しく交渉して30%安くなりましたが、信頼度が5下がりました...';
            break;
    }
    
    if (gameState.money >= finalPrice) {
        gameState.money -= finalPrice;
        gameState.dailyBuyCost += finalPrice;
        // スプレッド構文でオブジェクトをコピーして追加 (参照渡しを防ぐ)
        gameState.inventory.push({...gameState.currentOffer, purchasedPrice: finalPrice}); 
        showMessage(`${gameState.currentOffer.name}を${finalPrice}円で仕入れました！${message}`);
        generateNewOffer(); // 新しいオファーを生成
    } else {
        showMessage('お金が足りません！');
    }
    
    updateUI();
}

// 仕入れをスキップ
function skipBuy() {
    showMessage('今回の仕入れをスキップしました。陳列フェーズに進みます。');
    showPhase('display-phase');
    updateUI();
}

// 在庫から店頭に移動
function moveToShop(index) {
    if (index < 0 || index >= gameState.inventory.length) {
        return;
    }
    const item = gameState.inventory.splice(index, 1)[0];
    gameState.shopItems.push(item);
    showMessage(`${item.name}を店頭に並べました！`);
    updateUI();
}

// 陳列方法を設定
function setDisplayMode(mode) {
    gameState.displayMode = mode;
    const modeNames = {
        'normal': '普通陳列',
        'theme': 'テーマ展示',
        'sale': '安売りコーナー',
        'premium': 'プレミアム棚'
    };
    showMessage(`陳列方法を「${modeNames[mode]}」に設定しました！`);
    // active クラスの切り替え
    document.querySelectorAll('.display-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Find the button by its ID and add the active class
    const activeButton = document.getElementById(`display-${mode}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    updateUI();
}

// 陳列フェーズに進む
function goToDisplayPhase() {
    showPhase('display-phase');
    updateUI();
}

// 販売開始
function startSelling() {
    if (gameState.shopItems.length === 0) {
        showMessage('店頭に商品がありません！在庫から商品を並べてください。');
        return;
    }
    gameState.customerCount = 0; // その日の来店客数をリセット
    generateNewCustomer();
    showPhase('sell-phase');
}

// 新しいお客さんを生成（画像表示対応）
function generateNewCustomer() {
    gameState.currentCustomer = getRandomCustomer();
    document.getElementById('customer-name').textContent = gameState.currentCustomer.name;
    document.getElementById('customer-need').textContent = gameState.currentCustomer.need;
    
    // お客さんの画像を表示
    const customerPortrait = document.querySelector('.customer-portrait');
    const existingImg = customerPortrait.querySelector('img');
    
    if (existingImg) {
        existingImg.remove(); // 既存の画像があれば削除
    }
    
    // 新しい画像要素を作成
    const img = document.createElement('img');
    img.src = gameState.currentCustomer.image;
    img.alt = gameState.currentCustomer.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    
    // 画像読み込みエラーの場合は絵文字を表示
    img.onerror = function() {
        customerPortrait.innerHTML = gameState.currentCustomer.icon;
        customerPortrait.style.fontSize = '4em';
        customerPortrait.style.display = 'flex';
        customerPortrait.style.alignItems = 'center';
        customerPortrait.style.justifyContent = 'center';
    };
    
    // 画像が正常に読み込まれた場合
    img.onload = function() {
        customerPortrait.innerHTML = '';
        customerPortrait.appendChild(img);
    };
    
    // 画像を追加
    customerPortrait.appendChild(img);
    
    updateUI();
}

// お客様の購入判定
function customerBuy() {
    if (!gameState.currentCustomer || gameState.shopItems.length === 0) {
        showMessage('お客様がいないか、店頭に商品がありません。');
        return;
    }

    let boughtItem = null;
    let customerMessage = '';

    // お客様が好きな商品から優先的に探す
    const potentialBuys = gameState.shopItems
        .map((item, index) => ({ item, index, price: getItemPrice(item) }))
        .filter(data => gameState.currentCustomer.budget >= data.price)
        .sort((a, b) => {
            const aLiked = gameState.currentCustomer.likedItems.includes(a.item.id);
            const bLiked = gameState.currentCustomer.likedItems.includes(b.item.id);
            if (aLiked && !bLiked) return -1;
            if (!aLiked && bLiked) return 1;
            return 0; // どちらも好き、またはどちらも嫌いな場合
        });

    for (const data of potentialBuys) {
        const item = data.item;
        const price = data.price;
        let sellChance = item.popularity;

        // 陳列方法による売れやすさの変化
        switch (gameState.displayMode) {
            case 'theme': // テーマ展示: 好みに合えば売れやすい
                if (gameState.currentCustomer.likedItems.includes(item.id)) {
                    sellChance += 20;
                }
                break;
            case 'sale': // 安売りコーナー: 売れやすい
                sellChance += 30;
                break;
            case 'premium': // プレミアム棚: 売れにくい
                sellChance -= 20;
                break;
        }

        // お客さんの好みでさらに売れやすさ変動
        if (gameState.currentCustomer.likedItems.includes(item.id)) {
            sellChance += 25; // 好きな商品だと売れやすさ大幅アップ
        }
        
        // 信頼度も影響
        sellChance += (gameState.trust - 50) / 2; // 信頼度が高いほど売れやすい

        // 流行チェック
        const currentTrend = trends.find(t => t.day === gameState.day);
        if (currentTrend && item.type === currentTrend.boostItemType) {
            sellChance *= currentTrend.boostAmount;
            showMessage(`市場の流行で${item.name}が売れやすくなっています！`);
        }

        sellChance = Math.max(10, Math.min(100, sellChance)); // 最小10%、最大100%

        if (Math.random() * 100 < sellChance) {
            boughtItem = item;
            gameState.money += price;
            gameState.dailySellIncome += price;
            gameState.shopItems.splice(data.index, 1); // 販売した商品を店頭から削除
            customerMessage = `${gameState.currentCustomer.name}さんが${item.name}を${price}円で購入しました！`;
            gameState.trust = Math.min(100, gameState.trust + 2); // 購入があったら信頼度微増
            break;
        }
    }

    if (boughtItem) {
        showMessage(customerMessage);
        // 商品が売り切れたかチェック
        if (gameState.shopItems.length === 0) {
            setTimeout(() => {
                showMessage('商品が売り切れました！今日は大成功です。結果発表に進みます！');
                setTimeout(() => {
                    showResults();
                }, 2000);
            }, 1500);
            return;
        }
    } else {
        showMessage(`${gameState.currentCustomer.name}さんは何も買わずに帰りました。`);
        gameState.trust = Math.max(0, gameState.trust - 1); // 買わずに帰ったら信頼度微減
    }
    
    gameState.customerCount++; // 来店客数をカウント
    updateUI();
}

// 次のお客様を呼ぶか、結果フェーズへ
function nextCustomer() {
    if (gameState.customerCount >= 5) { // 例: 1日5人までのお客様
        showMessage('今日のお客様はもう終わりです。結果発表に進みます！');
        showResults();
    } else {
        showMessage('次のお客様が来店しました。');
        generateNewCustomer();
    }
}

// 販売終了
function endSelling() {
    showMessage('今日の販売を終了します。結果発表に進みます！');
    showResults();
}

// 結果フェーズへ移動し、結果を表示
function showResults() {
    document.getElementById('buy-cost').textContent = gameState.dailyBuyCost;
    document.getElementById('sell-income').textContent = gameState.dailySellIncome;
    document.getElementById('daily-profit').textContent = gameState.dailySellIncome - gameState.dailyBuyCost;
    document.getElementById('customer-count').textContent = gameState.customerCount;
    
    // 次の日の市場情報を表示
    const nextDayTrend = trends.find(t => t.day === gameState.day + 1);
    if (nextDayTrend) {
        document.getElementById('market-news').textContent = nextDayTrend.news;
    } else {
        document.getElementById('market-news').textContent = '特に目立った市場の動きはなさそうです。';
    }

    showPhase('result-phase');
    updateUI();
}

// 次の日へ進む
function nextDay() {
    gameState.day++;
    gameState.dailyBuyCost = 0;
    gameState.dailySellIncome = 0;
    gameState.shopItems = []; // 店頭商品をリセット
    gameState.displayMode = 'normal'; // 陳列モードをリセット
    gameState.customerCount = 0; // 来店客数をリセット
    
    showMessage(`Day ${gameState.day}が始まりました！`);
    generateNewOffer(); // 新しい仕入れオファーを生成
    showPhase('buy-phase'); // 仕入れフェーズに戻る
    updateUI();
    // 次の日に進んだら、陳列モードのボタンのアクティブ状態を「普通陳列」にリセット
    setDisplayMode('normal');
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    generateNewOffer();
    updateUI();
    showMessage('未来商店「コスモマート」へようこそ！仕入れから始めましょう。');
    
    // 初期の陳列モードボタンにactiveクラスを付ける
    // setDisplayMode関数を呼び出すことで、ボタンのアクティブ状態が正しく設定される
    setDisplayMode('normal'); 
});