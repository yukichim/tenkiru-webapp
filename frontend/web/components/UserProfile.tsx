'use client'

import { useState, useEffect } from 'react'
import { User, Edit, Save, Plus, Trash2, Shirt } from 'lucide-react'

interface UserProfileProps {
  user: {
    id: string
    email: string
    name: string
    gender?: string
    age?: number
    preferences?: {
      style: string[]
      colors: string[]
    }
  }
}

interface ClothingItem {
  id: string
  name: string
  type: string
  color: string
  category: 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories'
  imageUrl?: string
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<ClothingItem>>({
    name: '',
    type: '',
    color: '',
    category: 'tops'
  })

  useEffect(() => {
    fetchClothingItems()
  }, [])

  const fetchClothingItems = async () => {
    try {
      // TODO: Implement API call to fetch user's clothing items
      // For now, using mock data
      setClothingItems([
        {
          id: '1',
          name: 'ネイビーシャツ',
          type: 'シャツ',
          color: 'ネイビー',
          category: 'tops'
        },
        {
          id: '2',
          name: 'デニムパンツ',
          type: 'パンツ',
          color: 'ブルー',
          category: 'bottoms'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch clothing items:', error)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.type || !newItem.color) return

    try {
      // TODO: Implement API call to add clothing item
      const item: ClothingItem = {
        id: Date.now().toString(),
        name: newItem.name!,
        type: newItem.type!,
        color: newItem.color!,
        category: newItem.category!
      }
      
      setClothingItems(prev => [...prev, item])
      setNewItem({ name: '', type: '', color: '', category: 'tops' })
      setShowAddItem(false)
    } catch (error) {
      console.error('Failed to add clothing item:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      // TODO: Implement API call to delete clothing item
      setClothingItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Failed to delete clothing item:', error)
    }
  }

  const categoryLabels = {
    tops: 'トップス',
    bottoms: 'ボトムス',
    outerwear: 'アウター',
    shoes: 'シューズ',
    accessories: 'アクセサリー'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="w-6 h-6 mr-2" />
          プロフィール
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? '保存' : '編集'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お名前
            </label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年齢
            </label>
            <p className="text-gray-900">{user.age}歳</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            性別
          </label>
          <p className="text-gray-900">
            {user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : 'その他'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center">
            <Shirt className="w-5 h-5 mr-2" />
            マイクローゼット
          </h4>
          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>アイテム追加</span>
          </button>
        </div>

        {showAddItem && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium mb-3">新しいアイテムを追加</h5>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="アイテム名"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="種類（例：シャツ、パンツ）"
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="色"
                value={newItem.color}
                onChange={(e) => setNewItem(prev => ({ ...prev, color: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as ClothingItem['category'] }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {Object.entries(categoryLabels).map(([category, label]) => {
            const items = clothingItems.filter(item => item.category === category)
            if (items.length === 0) return null

            return (
              <div key={category} className="border rounded-lg p-3">
                <h5 className="font-medium text-gray-700 mb-2">{label}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({item.color})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          
          {clothingItems.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              まだアイテムが登録されていません。<br />
              「アイテム追加」ボタンからクローゼットを作成しましょう！
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
