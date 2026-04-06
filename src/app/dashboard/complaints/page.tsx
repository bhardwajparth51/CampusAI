"use client";

import React, { useState, useEffect } from "react";
import ManagementTable from "@/components/dashboard/management/ManagementTable";
import ComplaintDetailSidebar from "@/components/dashboard/management/ComplaintDetailSidebar";
import { Reveal } from "@/components/ui/Reveal";
import { account } from "@/lib/appwrite";
import { api } from "@/lib/api";
import { Icons } from "@/components/ui/Icons";
import { CTAButton } from "@/components/ui/CTAButton";
import NewComplaintModal from "@/components/dashboard/management/NewComplaintModal";

export default function ComplaintsPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const currentUser = await account.get();
        setUser(currentUser);

        // Sync with Backend Role
        try {
          const dbUser = await api.get(`/v1/users/me?email=${currentUser.email}`);
          setRole(dbUser.role);
        } catch (dbErr) {
          console.warn("ComplaintsPage: Role sync failed, defaulting to student", dbErr);
          setRole("student");
        }
      } catch (err) {
        console.error("ComplaintsPage: Auth failed", err);
        window.location.href = "/login?error=unauthenticated";
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 p-1 md:grid-cols-12 min-h-screen">
      {/* Header */}
      <div className="md:col-span-12 mb-2 flex items-center justify-between">
        <Reveal delay="0s">
          <h2 className="text-2xl font-bold text-white tracking-tight">Case Management</h2>
          <p className="text-white/40 text-sm mt-1">
            {role === 'admin' 
              ? "Global campus reports and resolution tracking." 
              : "Track and manage your submitted reports."}
          </p>
        </Reveal>

        {role === 'student' && (
          <CTAButton 
            onClick={() => setIsNewModalOpen(true)}
            className="h-10 px-5 text-sm font-bold"
          >
            <Icons.PlusCircle className="h-4 w-4" />
            New Case
          </CTAButton>
        )}
      </div>

      <NewComplaintModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        onSuccess={() => {
           window.location.reload(); // Quick refresh to show the new complaint
        }}
      />
      
      {/* Table Workspace */}
      <div className="md:col-span-12 relative">
        <ManagementTable 
            role={role} 
            userEmail={user.email} 
            onSelectComplaint={(id) => setSelectedId(id)} 
        />
        
        {/* Sidebar Overlay (if ID is selected) */}
        {selectedId && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={() => setSelectedId(null)}
              />
              <ComplaintDetailSidebar 
                  id={selectedId} 
                  role={role} 
                  onClose={() => setSelectedId(null)}
                  onActionComplete={() => {
                      // Trigger a table re-render if needed or just sync state
                      window.location.reload(); // Simple sync for now
                  }}
              />
            </>
        )}
      </div>
    </div>
  );
}
