"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, User, Tag, Share2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getArticleById, articles, categories } from "@/lib/knowledge-data"
import Link from "next/link"

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const article = getArticleById(articleId)

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <BookOpen className="h-16 w-16 text-green-300 mx-auto mb-4" />
            <CardTitle className="text-green-900">Article Not Found</CardTitle>
            <CardDescription>The article you're looking for doesn't exist or has been moved.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/knowledge">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Back to Education Hub</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const relatedArticles = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Article link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-green-700 hover:bg-green-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <Badge className="bg-green-600 hover:bg-green-700 text-white mb-4">
              {categories.find((c) => c.id === article.category)?.name}
            </Badge>

            <h1 className="text-4xl font-bold text-green-900 mb-4 text-balance">{article.title}</h1>

            <p className="text-xl text-green-700 mb-6 text-pretty">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-green-600">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.readTime}</span>
                </div>
                <div className="text-sm">
                  {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleShare}
                className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-8">
                <div className="prose prose-green max-w-none">
                  {article.content.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-green-900 mt-8 mb-4">
                          {paragraph.replace("## ", "")}
                        </h2>
                      )
                    } else if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-xl font-semibold text-green-800 mt-6 mb-3">
                          {paragraph.replace("### ", "")}
                        </h3>
                      )
                    } else if (paragraph.startsWith("- **")) {
                      return (
                        <li key={index} className="mb-2">
                          <strong className="text-green-800">{paragraph.match(/\*\*(.*?)\*\*/)?.[1]}:</strong>
                          {paragraph.replace(/- \*\*(.*?)\*\*:/, "")}
                        </li>
                      )
                    } else if (paragraph.startsWith("- ")) {
                      return (
                        <li key={index} className="mb-1 text-green-700">
                          {paragraph.replace("- ", "")}
                        </li>
                      )
                    } else if (paragraph.match(/^\d+\./)) {
                      return (
                        <li key={index} className="mb-2 text-green-700">
                          {paragraph.replace(/^\d+\.\s*/, "")}
                        </li>
                      )
                    } else if (paragraph.trim()) {
                      return (
                        <p key={index} className="mb-4 text-green-700 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-green-100">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-green-900">Related Articles</CardTitle>
                  <CardDescription>
                    More articles in {categories.find((c) => c.id === article.category)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link key={relatedArticle.id} href={`/knowledge/${relatedArticle.id}`}>
                      <div className="group p-3 rounded-lg border border-green-100 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                        <h4 className="font-medium text-green-900 group-hover:text-green-700 line-clamp-2 mb-2">
                          {relatedArticle.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Clock className="h-3 w-3" />
                          {relatedArticle.readTime}
                        </div>
                      </div>
                    </Link>
                  ))}

                  <Link href="/knowledge">
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      View All Articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
