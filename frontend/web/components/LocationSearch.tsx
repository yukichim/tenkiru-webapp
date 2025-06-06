"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface City {
  code: string;
  name: string;
  prefecture: string;
}

const cities: City[] = [
  { code: "011000", name: "稚内", prefecture: "北海道" },
  { code: "012010", name: "旭川", prefecture: "北海道" },
  { code: "016010", name: "札幌", prefecture: "北海道" },
  { code: "017010", name: "室蘭", prefecture: "北海道" },
  { code: "020010", name: "青森", prefecture: "青森県" },
  { code: "030010", name: "盛岡", prefecture: "岩手県" },
  { code: "040010", name: "仙台", prefecture: "宮城県" },
  { code: "050010", name: "秋田", prefecture: "秋田県" },
  { code: "060010", name: "山形", prefecture: "山形県" },
  { code: "070010", name: "福島", prefecture: "福島県" },
  { code: "080010", name: "水戸", prefecture: "茨城県" },
  { code: "090010", name: "宇都宮", prefecture: "栃木県" },
  { code: "100010", name: "前橋", prefecture: "群馬県" },
  { code: "110010", name: "さいたま", prefecture: "埼玉県" },
  { code: "120010", name: "千葉", prefecture: "千葉県" },
  { code: "130010", name: "東京", prefecture: "東京都" },
  { code: "140010", name: "横浜", prefecture: "神奈川県" },
  { code: "150010", name: "新潟", prefecture: "新潟県" },
  { code: "160010", name: "富山", prefecture: "富山県" },
  { code: "170010", name: "金沢", prefecture: "石川県" },
  { code: "180010", name: "福井", prefecture: "福井県" },
  { code: "190010", name: "甲府", prefecture: "山梨県" },
  { code: "200010", name: "長野", prefecture: "長野県" },
  { code: "210010", name: "岐阜", prefecture: "岐阜県" },
  { code: "220010", name: "静岡", prefecture: "静岡県" },
  { code: "230010", name: "名古屋", prefecture: "愛知県" },
  { code: "240010", name: "津", prefecture: "三重県" },
  { code: "250010", name: "大津", prefecture: "滋賀県" },
  { code: "260010", name: "京都", prefecture: "京都府" },
  { code: "270000", name: "大阪", prefecture: "大阪府" },
  { code: "280010", name: "神戸", prefecture: "兵庫県" },
  { code: "290010", name: "奈良", prefecture: "奈良県" },
  { code: "300010", name: "和歌山", prefecture: "和歌山県" },
  { code: "310010", name: "鳥取", prefecture: "鳥取県" },
  { code: "320010", name: "松江", prefecture: "島根県" },
  { code: "330010", name: "岡山", prefecture: "岡山県" },
  { code: "340010", name: "広島", prefecture: "広島県" },
  { code: "350020", name: "下関", prefecture: "山口県" },
  { code: "360010", name: "徳島", prefecture: "徳島県" },
  { code: "370000", name: "高松", prefecture: "香川県" },
  { code: "380010", name: "松山", prefecture: "愛媛県" },
  { code: "390010", name: "高知", prefecture: "高知県" },
  { code: "400010", name: "福岡", prefecture: "福岡県" },
  { code: "410010", name: "佐賀", prefecture: "佐賀県" },
  { code: "420010", name: "長崎", prefecture: "長崎県" },
  { code: "430010", name: "熊本", prefecture: "熊本県" },
  { code: "440010", name: "大分", prefecture: "大分県" },
  { code: "450010", name: "宮崎", prefecture: "宮崎県" },
  { code: "460010", name: "鹿児島", prefecture: "鹿児島県" },
  { code: "471010", name: "那覇", prefecture: "沖縄県" },
];

interface LocationSearchProps {
  onLocationChange: (cityCode: string) => void;
  selectedCity: string;
}

export default function LocationSearch({
  onLocationChange,
  selectedCity,
}: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = cities.filter(
    (city) =>
      city.name.includes(searchTerm) || city.prefecture.includes(searchTerm)
  );

  const selectedCityData = cities.find((city) => city.code === selectedCity);

  const handleCitySelect = (cityCode: string) => {
    onLocationChange(cityCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left font-medium text-lg hover:text-blue-600 transition-colors"
            >
              {selectedCityData
                ? `${selectedCityData.name} - ${selectedCityData.prefecture}`
                : "地域を選択"}
            </Button>
          </div>
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-80 overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="都市名または都道府県で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCities.map((city) => (
              <Button
                key={city.code}
                onClick={() => handleCitySelect(city.code)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  city.code === selectedCity ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-gray-500">{city.prefecture}</div>
              </Button>
            ))}

            {filteredCities.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                該当する地域が見つかりません
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onKeyDown={() => {}}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
