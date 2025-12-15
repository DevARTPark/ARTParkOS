import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { Card } from "../../../components/ui/Card";
import SearchBar from "../../../components/ui/SearchBar";
import ListSkeleton from "../../../components/ui/ListSkeleton";
import { Button } from "../../../components/ui/Button";
import { mentorsApi, Mentor } from "../../../api/portalApi";

export default function MentorListPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMentors();
  }, [searchQuery]);

  const loadMentors = async () => {
    setIsLoading(true);
    try {
      const data = searchQuery
        ? await mentorsApi.search(searchQuery)
        : await mentorsApi.getAll();
      setMentors(data);
    } catch (error) {
      console.error("Failed to load mentors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="founder" title="Mentors & Experts">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find a Mentor</h1>
            <p className="text-gray-600">
              Connect with industry experts for guidance.
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <SearchBar
              placeholder="Search by name or expertise..."
              onSearch={setSearchQuery}
            />
          </div>
        </div>

        {isLoading ? (
          <ListSkeleton count={3} />
        ) : mentors.length === 0 ? (
          <Card className="p-12 text-center text-gray-500">
            No mentors found.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Link key={mentor.id} to={`/founder/mentors/${mentor.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="h-16 w-16 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-gray-500">{mentor.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-sm text-yellow-600">
                          <Star className="h-3 w-3 fill-yellow-400" />
                          <span>{mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                      {mentor.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 3).map((exp, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full mt-auto"
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
