"use client";
import { Button } from "@/components/ui/button";
import {
  useClothingController,
  useClothingFilters,
  useClothingStats,
} from "@/controllers/ClothingController";
import { useEffect, useState } from "react";
import type { ClothingItem } from "../../types/index";
import {
  ClosetOverview,
  ClothingFilters,
  ClothingForm,
  ClothingItemCard,
} from "../ClothingComponents";
import { ErrorDisplay, Layout, Loading, Modal } from "../Common";

const ClosetPage: React.FC = () => {
  const {
    items,
    categories,
    loading,
    error,
    selectedItem,
    loadItems,
    loadCategories,
    addItem,
    updateItem,
    deleteItem,
    selectItem,
    clearError,
  } = useClothingController();

  const { filters, filteredItems, updateFilter, clearFilters } =
    useClothingFilters(items);
  const stats = useClothingStats(items);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [loadItems, loadCategories]);

  const handleAddItem = async (
    itemData: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => {
    await addItem(itemData);
    setShowAddForm(false);
  };

  const handleEditItem = async (
    itemData: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingItem) {
      await updateItem(editingItem.id, itemData);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirm(null);
  };

  if (loading && items.length === 0) {
    return (
      <Layout>
        <Loading message="クローゼットを読み込み中..." />
      </Layout>
    );
  }

  return (
    <Layout title="TENKIRU - Clothet">
      <div className="space-y-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              マイクローゼット
            </h1>
            <p className="text-gray-600">あなたの衣類を管理しましょう</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <svg
                  role="img"
                  aria-label="a"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <svg
                  role="img"
                  aria-label="b"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <svg
                role="img"
                aria-label="c"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              アイテム追加
            </Button>
          </div>
        </div>

        {error && (
          <ErrorDisplay
            error={error}
            onRetry={loadItems}
            onDismiss={clearError}
          />
        )}

        {/* 概要統計 */}
        <ClosetOverview items={items} categories={categories} />

        {/* フィルター */}
        <ClothingFilters
          categories={categories}
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />

        {/* アイテム一覧 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              アイテム ({filteredItems.length})
            </h2>
            {filteredItems.length !== items.length && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                フィルターをクリア
              </Button>
            )}
          </div>

          {filteredItems.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredItems.map((item) => (
                <ClothingItemCard
                  key={item.id}
                  item={item}
                  onEdit={setEditingItem}
                  onDelete={setDeleteConfirm}
                  onSelect={selectItem}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                role="img"
                aria-label="d"
                className="h-16 w-16 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-500">
                {items.length === 0
                  ? "まだアイテムがありません"
                  : "検索条件に一致するアイテムがありません"}
              </p>
              {items.length === 0 && (
                <Button onClick={() => setShowAddForm(true)} className="mt-4">
                  最初のアイテムを追加
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 追加フォームモーダル */}
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="新しいアイテムを追加"
          size="lg"
        >
          <ClothingForm
            categories={categories}
            onSubmit={handleAddItem}
            onCancel={() => setShowAddForm(false)}
          />
        </Modal>

        {/* 編集フォームモーダル */}
        <Modal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="アイテムを編集"
          size="lg"
        >
          {editingItem && (
            <ClothingForm
              item={editingItem}
              categories={categories}
              onSubmit={handleEditItem}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </Modal>

        {/* 削除確認モーダル */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="アイテムを削除"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              このアイテムを削除してもよろしいですか？この操作は取り消せません。
            </p>
            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDeleteItem(deleteConfirm)}
              >
                削除
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                キャンセル
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default ClosetPage;
