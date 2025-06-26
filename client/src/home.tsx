import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Play, 
  Code, 
  Rocket, 
  Loader2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search,
  Github,
  Globe,
  Layers,
  Smartphone,
  Wrench,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Removed dropdown imports - search only interface

interface ApiResponse {
  success: boolean;
  query: string;
  results: string[];
  count: number;
  timestamp: string;
  level?: number;
  cached?: boolean;
}

interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  // Removed browse mode - search only interface
  const { toast } = useToast();

  // Health check query
  const { data: healthData } = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Removed brand/device queries - search only interface

  // Search query
  const { 
    data: searchData, 
    error: searchError, 
    isLoading: isSearching,
    refetch 
  } = useQuery<ApiResponse, ErrorResponse>({
    queryKey: [`/api/search/${activeQuery}`],
    enabled: !!activeQuery,
    retry: false,
  });

  const handleQuickTest = (query: string) => {
    setActiveQuery(query);
  };

  const handleCustomSearch = () => {
    const query = searchQuery.trim();
    if (!query) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    setActiveQuery(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSearch();
    }
  };

  const copyResponse = async () => {
    if (searchData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(searchData, null, 2));
        setCopiedResponse(true);
        toast({
          title: "Copied!",
          description: "Response JSON copied to clipboard",
        });
        setTimeout(() => setCopiedResponse(false), 2000);
      } catch (err) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const getLevelInfo = (level?: number) => {
    switch (level) {
      case 1: return { icon: Layers, text: "Brand Level", color: "bg-blue-100 text-blue-800" };
      case 2: return { icon: Smartphone, text: "Device Level", color: "bg-green-100 text-green-800" };
      case 3: return { icon: Wrench, text: "Repair Level", color: "bg-purple-100 text-purple-800" };
      default: return { icon: Search, text: "Search", color: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RepairWizard</h1>
                <p className="text-sm text-gray-500">Intelligent Device Repair Search</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                {healthData ? 'API Online' : 'API Checking...'}
              </Badge>
              <a 
                href="https://github.com" 
                className="text-api-blue hover:text-blue-700 font-medium flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2" size={16} />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Enhanced Search Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Device Search */}
          <Card>
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-api-dark flex items-center">
                <Search className="text-api-blue mr-2" size={18} />
                Device Repair Search
              </h3>
              <p className="text-sm text-gray-600">Search for device brands, models, or specific repair guides</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Search Input */}
                <div>
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Devices & Repairs:
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        id="search-input"
                        placeholder="e.g., iPhone 15 Pro, Samsung Galaxy S24, MacBook Air M2..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10 h-12"
                      />
                      <Search className="absolute right-3 top-4 text-gray-400" size={16} />
                    </div>
                    <Button onClick={handleCustomSearch} className="bg-api-blue hover:bg-blue-700 h-12 px-6">
                      Search
                    </Button>
                  </div>
                </div>

                {/* Popular Searches */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Popular Searches:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('iPhone 15 Pro')}
                    >
                      iPhone 15 Pro
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('Galaxy S24 Ultra')}
                    >
                      Galaxy S24 Ultra
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('MacBook Air M2')}
                    >
                      MacBook Air M2
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('iPad Pro')}
                    >
                      iPad Pro
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('AirPods Pro')}
                    >
                      AirPods Pro
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                      onClick={() => handleQuickTest('Nintendo Switch')}
                    >
                      Nintendo Switch
                    </Button>
                  </div>
                </div>

                {/* Brand Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Browse by Brand:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'Nintendo', 'OnePlus', 'Xiaomi'].map((brand) => (
                      <Button
                        key={brand}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTest(brand.toLowerCase())}
                        className="text-xs"
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Server Status */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                  <span>Server Status:</span>
                  <span className="flex items-center">
                    {healthData ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Online
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        Checking...
                      </>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card>
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold text-api-dark flex items-center">
                <Code className="text-api-blue mr-2" size={18} />
                API Response
              </h3>
            </CardHeader>
            <CardContent>
              <div className="min-h-64">
                {!activeQuery && (
                  <div className="text-center py-12">
                    <Rocket className="mx-auto text-4xl text-gray-300 mb-4" size={64} />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">Ready to Test</h4>
                    <p className="text-gray-400">Click a quick test button or enter a custom search to see the API response</p>
                  </div>
                )}

                {isSearching && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center">
                      <Loader2 className="animate-spin text-2xl text-api-blue mr-3" size={32} />
                      <span className="text-gray-600">Calling API...</span>
                    </div>
                  </div>
                )}

                {searchError && (
                  <div className="text-center py-8">
                    <AlertTriangle className="mx-auto text-3xl text-red-400 mb-3" size={48} />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">API Error</h4>
                    <p className="text-gray-600">{searchError.message || 'An error occurred while fetching data'}</p>
                  </div>
                )}

                {searchData && (
                  <div>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Request:</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            200 OK
                          </Badge>
                          {searchData.level && (
                            <Badge className={getLevelInfo(searchData.level).color}>
                              {getLevelInfo(searchData.level).text}
                            </Badge>
                          )}
                          {searchData.cached && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Cached
                            </Badge>
                          )}
                        </div>
                      </div>
                      <code className="text-sm text-api-blue">GET /api/search/{activeQuery}</code>
                    </div>

                    {/* Enhanced Results Display */}
                    {searchData.level === 3 && Array.isArray(searchData.results) && searchData.results.length > 0 && searchData.results[0].includes('Replacement') ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Available Repair Guides:</h4>
                        <div className="grid gap-3">
                          {searchData.results.map((guide, index) => (
                            <div key={index} className="bg-white border rounded-lg p-3 hover:border-api-blue transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-api-blue rounded-lg flex items-center justify-center">
                                    <Wrench className="text-white" size={16} />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{guide}</h5>
                                    <p className="text-sm text-gray-500">Estimated time: 30-60 minutes</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-orange-600 border-orange-200">
                                  Moderate
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono">
                          {JSON.stringify(searchData, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>Results: {searchData.count} items</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={copyResponse}
                        className="text-api-blue hover:text-blue-700"
                      >
                        {copiedResponse ? (
                          <>
                            <Check className="mr-1" size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1" size={14} />
                            Copy JSON
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Reference */}
        <Card className="mt-8">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-api-dark flex items-center">
              <Code className="text-api-blue mr-2" size={18} />
              API Endpoints
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">Search Endpoint</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border block mb-2">GET /api/search/:query</code>
                  <p className="text-sm text-gray-600">Hierarchical search for brands, devices, and repair guides</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">Brands Endpoint</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border block mb-2">GET /api/brands</code>
                  <p className="text-sm text-gray-600">Get all available device brands</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">Guide Details</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border block mb-2">GET /api/guide/:device</code>
                  <p className="text-sm text-gray-600">Detailed repair guide information with tools and difficulty</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h4 className="font-medium text-gray-900 mb-2">API Statistics</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border block mb-2">GET /api/stats</code>
                  <p className="text-sm text-gray-600">API usage statistics and system information</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Demo Section - Moved to Bottom */}
        <Card className="mt-8">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-semibold text-api-dark flex items-center">
              <Play className="text-api-blue mr-2" size={18} />
              API Demo & Documentation
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Complete API reference and live testing interface for recruitment demonstration
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* API Endpoints Documentation */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Available Endpoints</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Core Endpoints</h5>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="text-green-600 border-green-200 mt-0.5">GET</Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-800">/api/search/:query</code>
                          <p className="text-xs text-gray-600 mt-1">Intelligent hierarchical search</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="text-green-600 border-green-200 mt-0.5">GET</Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-800">/api/brands</code>
                          <p className="text-xs text-gray-600 mt-1">List all available brands</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="text-green-600 border-green-200 mt-0.5">GET</Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-800">/api/health</code>
                          <p className="text-xs text-gray-600 mt-1">Server health check</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-3">Enhanced Features</h5>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="text-green-600 border-green-200 mt-0.5">GET</Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-800">/api/guide/:device</code>
                          <p className="text-xs text-gray-600 mt-1">Detailed repair guide with tools</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="text-green-600 border-green-200 mt-0.5">GET</Badge>
                        <div>
                          <code className="text-sm font-mono text-gray-800">/api/stats</code>
                          <p className="text-xs text-gray-600 mt-1">API usage statistics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Search Examples */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Search Level Examples</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <Badge variant="outline" className="text-blue-600 border-blue-200 mb-2">Level 1</Badge>
                    <p className="text-sm font-medium text-gray-900">Brand Search</p>
                    <code className="text-xs text-gray-600">apple → [iphone, ipad, macbook...]</code>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <Badge variant="outline" className="text-purple-600 border-purple-200 mb-2">Level 2</Badge>
                    <p className="text-sm font-medium text-gray-900">Device Search</p>
                    <code className="text-xs text-gray-600">iphone → [iPhone 15 Pro, iPhone 14...]</code>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <Badge variant="outline" className="text-red-600 border-red-200 mb-2">Level 3</Badge>
                    <p className="text-sm font-medium text-gray-900">Repair Search</p>
                    <code className="text-xs text-gray-600">iPhone 13 → [Battery, Screen...]</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 RepairAPI Demo - Professional Backend Implementation</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Github size={16} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Globe size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
