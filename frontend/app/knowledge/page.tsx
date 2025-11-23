"use client"

import { useState } from "react"
import { Search, BookOpen, Clock, User, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories, articles, searchArticles, getArticlesByCategory } from "@/lib/knowledge-data"
import Link from "next/link"

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredArticles, setFilteredArticles] = useState(articles)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (selectedCategory) {
      const categoryArticles = getArticlesByCategory(selectedCategory)
      setFilteredArticles(
        searchArticles(query).filter((article) => categoryArticles.some((catArticle) => catArticle.id === article.id)),
      )
    } else {
      setFilteredArticles(searchArticles(query))
    }
  }

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      const categoryArticles = getArticlesByCategory(categoryId)
      setFilteredArticles(
        searchQuery
          ? searchArticles(searchQuery).filter((article) =>
              categoryArticles.some((catArticle) => catArticle.id === article.id),
            )
          : categoryArticles,
      )
    } else {
      setFilteredArticles(searchQuery ? searchArticles(searchQuery) : articles)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-xl mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-sm">Education Hub</h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            Comprehensive agricultural knowledge to help you grow better crops and build a sustainable farming
            business
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles, topics, or techniques..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedCategory === null
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                  onClick={() => handleCategoryFilter(null)}
                >
                  All Articles ({articles.length})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                    onClick={() => handleCategoryFilter(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name} ({category.articleCount})
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-green-900">
                {selectedCategory
                  ? `${categories.find((c) => c.id === selectedCategory)?.name} Articles`
                  : searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "All Articles"}
              </h2>
              <p className="text-green-600 mt-1">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-300"
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        {categories.find((c) => c.id === article.category)?.name}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-green-900 group-hover:text-green-700 transition-colors line-clamp-2">
                      <Link href={`/knowledge/${article.id}`}>{article.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-green-600 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Link href={`/knowledge/${article.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Read Article</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">No articles found</h3>
                <p className="text-green-600 mb-4">Try adjusting your search terms or browse different categories</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                    setFilteredArticles(articles)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  View All Articles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
