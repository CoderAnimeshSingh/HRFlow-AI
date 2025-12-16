import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, MessageSquare, Activity, Send, 
  UserPlus, Clock, CheckCircle, Eye, Edit2 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityItem {
  id: string;
  user_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

interface Comment {
  id: string;
  candidate_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface TeamCollaborationProps {
  candidateId?: string;
  candidateName?: string;
}

export const TeamCollaboration = ({ candidateId, candidateName }: TeamCollaborationProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
    if (candidateId) {
      fetchComments(candidateId);
    }

    // Real-time subscriptions
    const activityChannel = supabase
      .channel('activity-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        fetchActivities();
      })
      .subscribe();

    const commentChannel = supabase
      .channel('comment-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidate_comments' }, () => {
        if (candidateId) fetchComments(candidateId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(commentChannel);
    };
  }, [candidateId]);

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setActivities(data);
    }
  };

  const fetchComments = async (id: string) => {
    const { data, error } = await supabase
      .from('candidate_comments')
      .select('*')
      .eq('candidate_id', id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !candidateId) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('candidate_comments')
        .insert({
          candidate_id: candidateId,
          user_id: user.id,
          user_name: profile?.full_name || user.email || 'Team Member',
          content: newComment.trim(),
        });

      if (error) throw error;

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: user.id,
        user_name: profile?.full_name || user.email,
        action: 'commented',
        entity_type: 'candidate',
        entity_id: candidateId,
        details: { candidate_name: candidateName },
      });

      setNewComment("");
      toast({ title: "Comment Added", description: "Your comment has been posted." });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'commented': return <MessageSquare className="h-4 w-4" />;
      case 'updated_status': return <Edit2 className="h-4 w-4" />;
      case 'hired': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'hired': return 'text-emerald-500 bg-emerald-500/10';
      case 'commented': return 'text-blue-500 bg-blue-500/10';
      case 'updated_status': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Activity className="h-10 w-10 mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user_name || 'Team Member'}</span>
                          {' '}{activity.action.replace('_', ' ')}{' '}
                          {activity.details?.candidate_name && (
                            <span className="text-primary">{activity.details.candidate_name}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {candidateId ? `Discussion: ${candidateName}` : 'Team Discussion'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {candidateId ? (
            <>
              <ScrollArea className="h-[300px] pr-4 mb-4">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-xs">Start the discussion!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-muted rounded-lg p-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {comment.user_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{comment.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addComment()}
                  disabled={loading}
                />
                <Button onClick={addComment} disabled={loading || !newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">Select a candidate</p>
              <p className="text-sm">to view or add comments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Utility function to log activity from anywhere
export const logActivity = async (
  action: string, 
  entityType: string, 
  entityId?: string, 
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .single();

    await supabase.from('activity_log').insert({
      user_id: user.id,
      user_name: profile?.full_name || user.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
