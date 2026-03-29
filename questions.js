window.questions = [
  {
    id: "householdSize",
    type: "single",
    title: "同居している人数を選んでください",
    description: "結果画面で必要な備蓄量の目安を表示します。",
    options: [
      { label: "1人", value: "1" },
      { label: "2人", value: "2" },
      { label: "3〜4人", value: "4" },
      { label: "5人以上", value: "5" }
    ]
  },
  {
    id: "livingArea",
    type: "multi",
    title: "生活圏にあてはまる条件を選んでください",
    description: "重なる条件は複数選択してください。",
    options: [
      {
        label: "海沿い・津波を想定する地域",
        value: "tsunamiArea",
        scoreEffect: { immediate: 1, evacuation: 4, survival: 1 }
      },
      {
        label: "川沿い・低地・浸水が気になる地域",
        value: "floodArea",
        scoreEffect: { immediate: 1, evacuation: 3, survival: 2 }
      },
      {
        label: "高台・斜面・高低差のある地域",
        value: "slopeArea",
        scoreEffect: { immediate: 1, evacuation: 2, survival: 1 }
      }
    ]
  },
  {
    id: "nuclearPlant",
    type: "single",
    title: "原子力発電所との位置関係に近いものを選んでください",
    description: "PAZ・UPZを意識しながら、原子力災害時の備えを確認します。",
    options: [
      {
        label: "近くにない",
        value: "none",
        scoreEffect: { immediate: 0, evacuation: 0, survival: 0, role: 0 }
      },
      {
        label: "比較的近い（5〜30km以内）",
        value: "upz",
        scoreEffect: { immediate: 0, evacuation: 1, survival: 1, role: 1 }
      },
      {
        label: "近くにある（5km未満）",
        value: "paz",
        scoreEffect: { immediate: 0, evacuation: 2, survival: 2, role: 2 }
      },
      {
        label: "わからない",
        value: "unknown",
        scoreEffect: { immediate: 0, evacuation: 1, role: 1 }
      }
    ]
  },
  {
    id: "earthquakeFireMeasures",
    type: "multi",
    title: "【地震・火災】実施している対策を選んでください",
    description: "実施済みのものを複数選択してください。",
    options: [
      {
        label: "自宅の家具を固定している",
        value: "furnitureFix",
        scoreEffect: { immediate: -2 }
      },
      {
        label: "感震ブレーカーを設置している",
        value: "seismicBreaker",
        scoreEffect: { immediate: -2 }
      },
      {
        label: "消火器を設置している",
        value: "fireExtinguisher",
        scoreEffect: { immediate: -1 }
      }
    ]
  },
  {
    id: "stockpileMeasures",
    type: "multi",
    title: "【備蓄・ライフライン】実施している対策を選んでください",
    description: "行動ベースで複数選択してください。",
    options: [
      {
        label: "7日分の水を備蓄している",
        value: "waterStock",
        scoreEffect: { survival: -2 }
      },
      {
        label: "7日分の食料を備蓄している",
        value: "foodStock",
        scoreEffect: { survival: -2 }
      },
      {
        label: "簡易トイレを備蓄している",
        value: "toiletStock",
        scoreEffect: { survival: -2 }
      },
      {
        label: "ポータブル電源や予備バッテリーを備えている",
        value: "backupPower",
        scoreEffect: { survival: -2, role: -1 }
      },
      {
        label: "ライトやラジオなどの情報取得手段を備えている",
        value: "lightingInfo",
        scoreEffect: { survival: -2 }
      },
      {
        label: "カセットコンロなどの代替熱源を備えている",
        value: "alternativeHeat",
        scoreEffect: { survival: -1 }
      }
    ]
  },
  {
    id: "evacuationMeasures",
    type: "multi",
    title: "【避難】実施している対策を選んでください",
    description: "知識と行動の両方を確認します。",
    options: [
      {
        label: "避難先や避難経路を確認している",
        value: "evacuationPlan",
        scoreEffect: { evacuation: -2 }
      },
      {
        label: "少しでも危険を感じたらすぐ避難する意識がある",
        value: "earlyEvacuation",
        scoreEffect: { evacuation: -2 }
      },
      {
        label: "家族や身近な人と避難先や連絡方法を共有している",
        value: "familyContactRule",
        scoreEffect: { evacuation: -2, role: -2 }
      }
    ]
  }
];
