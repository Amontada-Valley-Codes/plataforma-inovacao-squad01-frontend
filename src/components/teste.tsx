<AccordionContent className="px-4 pt-4 border-t">
                      <div className="space-y-6">

                        {/* Seção de Avaliações */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Pareceres dos Avaliadores:</h4>
                          {idea.evaluations.length > 0 ? (
                            idea.evaluations.map((evaluation) => (
                              <div key={evaluation.id} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                  <Avatar className="w-8 h-8"><AvatarFallback>{evaluation.evaluator.name.charAt(0)}</AvatarFallback></Avatar>
                                  <div>
                                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{evaluation.evaluator.name}</p>
                                    <Badge variant="outline">{evaluation.stage === 'PRE_TRIAGEM' ? 'Pré-Triagem' : 'Triagem Detalhada'}</Badge>
                                  </div>
                                </div>

                                {/* 💡 RENDERIZAÇÃO CONDICIONAL DOS CRITÉRIOS */}
                                <div className="pl-11 space-y-2">
                                  {evaluation.stage === 'PRE_TRIAGEM' && evaluation.criteria && (
                                    <div className='space-y-1 text-sm'>
                                      <p className={evaluation.criteria.alignment ? 'text-green-600 flex items-center gap-2' : 'text-gray-500 flex items-center gap-2'}><CheckSquare size={16} /> Alinhamento Estratégico: {evaluation.criteria.alignment ? 'Sim' : 'Não'}</p>
                                      <p className={evaluation.criteria.innovative ? 'text-green-600 flex items-center gap-2' : 'text-gray-500 flex items-center gap-2'}><CheckSquare size={16} /> Potencial Inovador: {evaluation.criteria.innovative ? 'Sim' : 'Não'}</p>
                                      <p className={evaluation.criteria.relevance ? 'text-green-600 flex items-center gap-2' : 'text-gray-500 flex items-center gap-2'}><CheckSquare size={16} /> Relevância para o Negócio: {evaluation.criteria.relevance ? 'Sim' : 'Não'}</p>
                                    </div>
                                  )}
                                  {evaluation.stage === 'TRIAGEM_DETALHADA' && evaluation.criteria && (
                                    <div className='space-y-2 text-sm italic'>
                                      {evaluation.criteria.viability && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Viabilidade:</span> "{evaluation.criteria.viability}"</p>}
                                      {evaluation.criteria.impact && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Impacto:</span> "{evaluation.criteria.impact}"</p>}
                                      {evaluation.criteria.risks && <p className={`text-gray-600 dark:text-gray-300`}><span className='font-semibold not-italic'>Riscos:</span> "{evaluation.criteria.risks}"</p>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma avaliação ainda.</p>
                          )}
                        </div>

                        <Separator />

                        {/* --- INÍCIO DA NOVA SECÇÃO DE COMENTÁRIOS --- */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Discussão do Comitê</h4>

                          {/* Lista de comentários existentes */}
                          <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                            {idea.discussionComments.length > 0 ? (
                              idea.discussionComments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <Avatar className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}><AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback></Avatar>
                                  <div>
                                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{comment.author.name}</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{comment.createdAt}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum comentário na discussão ainda.</p>
                            )}
                          </div>

                          {/* Formulário para novo comentário */}
                          <div className="flex items-start gap-3 pt-4 border-t">
                            <Avatar className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="w-full space-y-2">
                              <Textarea
                                placeholder="Adicione seu parecer ou comentário..."
                                value={newComment[idea.id] || ''}
                                onChange={(e) => setNewComment(prev => ({ ...prev, [idea.id]: e.target.value }))}
                                className={`focus:border-[#001f61] focus:ring focus:ring-[#001f61]/30 transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'}`}
                              />
                              <div className="flex justify-end">
                                <Button className={`${theme === 'dark' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-500 transition-colors`} size="sm" onClick={() => handlePostComment(idea.id)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Publicar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* --- FIM DA NOVA SECÇÃO --- */}

                        <Separator />

                        {/* Ações do Comitê */}
                        <div className="flex justify-end gap-4">
                          <Button variant="destructive" onClick={() => handleDecision(idea.id, 'reject')} className="bg-red-600 hover:bg-red-700 transition-all cursor-pointer">
                            <X className="w-4 h-4 mr-2" />
                            Rejeitar Ideia
                          </Button>
                          <Button onClick={() => handleDecision(idea.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white transition-all cursor-pointer">
                            <Check className="w-4 h-4 mr-2" />
                            Aprovar para Ideação
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>